import { testMocks } from '@suite-common/test-utils';
import { prepareDeviceReducer, deviceActions } from '@suite-common/wallet-core';
import CerberusConnect from '@cerberus/connect';

import { configureStore } from 'src/support/tests/configureStore';
import suiteReducer from 'src/reducers/suite/suiteReducer';
import { extraDependencies } from 'src/support/extraDependencies';

import fixtures from '../__fixtures__/deviceSettings';

const { getSuiteDevice } = testMocks;

const deviceReducer = prepareDeviceReducer(extraDependencies);

jest.doMock('@cerberus/suite-analytics', () => testMocks.getAnalytics());

const DEVICE = getSuiteDevice({ path: '1', connected: true });

type State = {
    suite: ReturnType<typeof suiteReducer>;
    device: ReturnType<typeof deviceReducer>;
};

export const getInitialState = (state: Partial<State> = {}) => ({
    suite: {
        ...suiteReducer(undefined, { type: '@suite/init' }),
    },
    device: {
        devices: state.device?.devices ?? [DEVICE],
        selectedDevice: DEVICE,
    },
    router: {},
});

const mockStore = configureStore<State, any>();

const initStore = (state: State) => {
    const store = mockStore(state);
    store.subscribe(() => {
        const action = store.getActions().pop();
        const { suite, device } = store.getState();
        // process action in reducers
        store.getState().suite = suiteReducer(suite, action);
        store.getState().device = deviceReducer(device, action);
        // add action back to stack
        store.getActions().push(action);
    });

    return store;
};

describe('DeviceSettings Actions', () => {
    fixtures.forEach(f => {
        it(f.description, async () => {
            const store = initStore(getInitialState(f.initialState));
            // wipe device tests require "device-change" event from "@cerberus/connect"
            // this action have influence on reducers and forget device process
            const mock = () => {
                if (f.deviceChange) {
                    store.dispatch(deviceActions.deviceChanged(f.deviceChange));
                    store.dispatch(deviceActions.updateSelectedDevice(f.deviceChange));
                }

                return Promise.resolve(f.mocks) as any;
            };
            jest.spyOn(CerberusConnect, 'applySettings').mockImplementation(mock);
            jest.spyOn(CerberusConnect, 'wipeDevice').mockImplementation(mock);
            jest.spyOn(CerberusConnect, 'changePin').mockImplementation(mock);

            await store.dispatch(f.action());

            if (f.result) {
                if (f.result.actions) {
                    expect(store.getActions()).toMatchObject(f.result.actions);
                }
            }
        });
    });
});
