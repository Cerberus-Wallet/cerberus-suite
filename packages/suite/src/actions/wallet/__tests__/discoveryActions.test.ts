// unit test for discovery actions
// data provided by CerberusConnect are mocked

import {
    prepareDiscoveryReducer,
    accountsActions,
    createDiscoveryThunk,
    restartDiscoveryThunk,
    startDiscoveryThunk,
    stopDiscoveryThunk,
    updateNetworkSettingsThunk,
    selectIsDiscoveryAuthConfirmationRequired,
} from '@suite-common/wallet-core';
import { ArrayElement } from '@cerberus/type-utils';
import { NetworkSymbol } from '@suite-common/wallet-config';
import { testMocks } from '@suite-common/test-utils';
import { notificationsActions } from '@suite-common/toast-notifications';
import { DiscoveryStatus } from '@suite-common/wallet-constants';
import * as discoveryActions from '@suite-common/wallet-core';
import CerberusConnect from '@cerberus/connect';

import { configureStore, filterThunkActionTypes } from 'src/support/tests/configureStore';
import walletSettingsReducer from 'src/reducers/wallet/settingsReducer';
import { accountsReducer } from 'src/reducers/wallet';
import * as walletSettingsActions from 'src/actions/settings/walletSettingsActions';
import { extraDependencies } from 'src/support/extraDependencies';

import {
    paramsError,
    fixtures,
    interruptionFixtures,
    changeNetworksFixtures,
    unavailableCapabilities,
} from '../__fixtures__/discoveryActions';

const discoveryReducer = prepareDiscoveryReducer(extraDependencies);

const { getSuiteDevice } = testMocks;

type FixtureType = ArrayElement<typeof fixtures>;
type Fixture = Partial<Omit<FixtureType, 'connect'>> & {
    connect: Partial<FixtureType['connect']>;
};
type FixtureInput = Fixture | Promise<Fixture> | ((..._args: any[]) => any);

const setCerberusConnectFixtures = (input?: FixtureInput) => {
    let progressCallback = (..._args: any[]): any => {};

    let fixture = input;
    const updateCerberusConnectFixtures = (input?: FixtureInput) => {
        fixture = input;
    };

    // mocked function
    const mockedGetAccountInfo = (
        params: Parameters<(typeof CerberusConnect)['getAccountInfo']>[0],
    ) => {
        // this error applies only for tests
        if (typeof fixture === 'undefined') {
            return paramsError('Default error. Fixtures not set');
        }
        // this promise will be resolved by CerberusConnect.cancel
        if (fixture instanceof Promise) {
            return fixture;
        }

        if (typeof fixture === 'function') {
            return fixture.call(null, progressCallback);
        }

        const { connect } = fixture;
        if (connect.error) {
            // error code is used in case where one of requested coins is not supported
            const { code, error } = connect.error;
            if (code) {
                delete connect.error; // reset this value, it shouldn't be used in next iteration

                return paramsError(error, code);
            }

            return paramsError(error);
        }

        // emit BUNDLE_PROGRESS
        for (let i = 0; i < params.bundle.length; i++) {
            const param = params.bundle[i];
            const accountType = param.path!.split('/').slice(0, 3).join('/');
            let isEmpty = true;
            let isFailed = false;

            if (connect.interruption) {
                const interrupted = connect.interruption.indexOf(param.path!);
                if (interrupted >= 0) {
                    connect.interruption[interrupted] = 'interruption-item-used';

                    return {
                        success: false,
                        payload: {
                            error: 'discovery_interrupted',
                        },
                    };
                }
            }

            if (connect.usedAccounts) {
                connect.usedAccounts.some(a => {
                    const found = a.indexOf(accountType) >= 0;
                    if (found && param.path !== a) {
                        isEmpty = false;

                        return true;
                    }

                    return false;
                });
            }

            if (connect.failedAccounts) {
                connect.failedAccounts.some(a => {
                    const found = a.indexOf(accountType) >= 0;
                    if (found && param.path === a) {
                        isFailed = true;

                        return true;
                    }

                    return false;
                });
            }

            if (isFailed) {
                progressCallback.call(null, {
                    progress: i,
                    response: null,
                    error: 'Runtime discovery error',
                });
            } else {
                progressCallback.call(null, {
                    progress: i,
                    response: {
                        descriptor: param.path,
                        empty: isEmpty,
                        history: {},
                    },
                    error: null,
                });
            }
        }

        if (connect.success) {
            return {
                success: true,
            };
        }

        return paramsError('Fixture response not defined');
    };

    jest.spyOn(CerberusConnect, 'on').mockImplementation((_event, cb) => {
        progressCallback = cb;
    });
    jest.spyOn(CerberusConnect, 'off').mockImplementation(() => {
        progressCallback = () => {};
    });
    jest.spyOn(CerberusConnect, 'getAccountInfo').mockImplementation(mockedGetAccountInfo);

    return {
        mockedGetAccountInfo,
        updateCerberusConnectFixtures,
    };
};

const SUITE_DEVICE = getSuiteDevice({ state: 'device-state', connected: true });
export const getInitialState = (device = SUITE_DEVICE) => ({
    device: {
        devices: [device],
        selectedDevice: device,
    },
    metadata: { enabled: false, providers: [] }, // don't use labeling in unit:tests
    wallet: {
        discovery: discoveryReducer(undefined, { type: 'foo' } as any),
        accounts: accountsReducer(undefined, { type: 'foo' } as any),
        settings: walletSettingsReducer(undefined, {
            type: walletSettingsActions.changeNetworks.type,
            payload: ['btc', 'test'],
        }),
    },
});

type State = ReturnType<typeof getInitialState>;

const mockStore = configureStore<State, any>();

const initStore = (state: State = getInitialState()) => {
    const store = mockStore(state);
    store.subscribe(() => {
        const action = store.getActions().pop();
        const { accounts, discovery, settings } = store.getState().wallet;
        store.getState().wallet = {
            accounts: accountsReducer(accounts, action),
            discovery: discoveryReducer(discovery, action),
            settings: walletSettingsReducer(settings, action),
        };
        // add action back to stack
        store.getActions().push(action);
    });

    return store;
};

describe('Discovery Actions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    fixtures.forEach(f => {
        it(f.description, async () => {
            // set fixtures in @cerberus/connect
            setCerberusConnectFixtures(f);
            const store = initStore(getInitialState(f.device));
            if (f.enabledNetworks) {
                store.dispatch(
                    walletSettingsActions.changeNetworks(f.enabledNetworks as NetworkSymbol[]),
                );
            }

            store.dispatch(
                createDiscoveryThunk({
                    deviceState: 'device-state',
                    device: f.device || SUITE_DEVICE,
                }),
            );
            await store.dispatch(startDiscoveryThunk());

            const result = store.getState().wallet.discovery[0];
            if (f.result) {
                expect(result.failed).toEqual(f.result.failed);
                expect(result.loaded).toEqual(result.total);
                expect(result.loaded).toEqual(store.getState().wallet.accounts.length);
                expect(result.bundleSize).toEqual(0);
            } else {
                const action = filterThunkActionTypes(store.getActions()).pop();
                expect(action?.type).toEqual(notificationsActions.addToast.type);
            }
        });
    });

    // Detailed info about this test could be found in fixtures
    interruptionFixtures.forEach(f => {
        it(`Start/stop/change networks/start: ${f.description}`, async () => {
            // @ts-expect-error fixtures connect.interruption ...
            setCerberusConnectFixtures(f);
            const store = initStore();
            // additional action listener for triggering "discovery.stop" action
            store.subscribe(() => {
                const actions = store.getActions();
                const a = actions[actions.length - 1];
                if (accountsActions.createAccount.match(a)) {
                    // call "stop" if added account is a trigger from fixtures
                    const trigger = f.trigger.find(t => a.payload.path.indexOf(t) >= 0);
                    if (trigger) {
                        store.dispatch(stopDiscoveryThunk());
                    }
                }
            });

            store.dispatch(
                createDiscoveryThunk({
                    deviceState: 'device-state',
                    device: SUITE_DEVICE,
                }),
            );

            // restart discovery until complete
            const loop = async (): Promise<any> => {
                await store.dispatch(startDiscoveryThunk());
                const actions = filterThunkActionTypes(store.getActions());
                const lastAction = actions.pop();
                if (lastAction?.type === discoveryActions.stopDiscovery.type) {
                    // since interruption is always called after account creation
                    // correct order for recent actions is: stop < update < interrupt (discoveryActions.handleProgress)
                    const update = actions.pop();
                    const interrupt = actions.pop();
                    expect(update?.type).toEqual(discoveryActions.updateDiscovery.type);
                    expect(interrupt?.type).toEqual(discoveryActions.interruptDiscovery.type);
                    store.clearActions();

                    return loop();
                }

                return lastAction;
            };

            const complete = await loop();
            expect(complete.type).toEqual(discoveryActions.completeDiscovery.type);
            const discovery = store.getState().wallet.discovery[0];
            expect(discovery.loaded).toEqual(store.getState().wallet.accounts.length);
            expect(discovery.total).toEqual(discovery.loaded);
        });
    });

    changeNetworksFixtures.forEach(f => {
        it(`Change network: ${f.description}`, async () => {
            setCerberusConnectFixtures(f);
            const state = getInitialState();
            const store = initStore(state);
            // additional action listener for triggering "discovery.updateNetworkSettings" action
            store.subscribe(() => {
                const actions = store.getActions();
                const a = actions[actions.length - 1];
                if (accountsActions.createAccount.match(a)) {
                    // call "updateNetworkSettings" if added account is a trigger from fixtures
                    const trigger = f.trigger.find(t => a.payload.path.indexOf(t.path) >= 0);
                    if (trigger) {
                        store.dispatch(
                            walletSettingsActions.changeNetworks(
                                trigger.networks as NetworkSymbol[],
                            ),
                        );
                        store.dispatch(updateNetworkSettingsThunk());
                    }
                }
            });

            store.dispatch(
                createDiscoveryThunk({
                    deviceState: 'device-state',
                    device: SUITE_DEVICE,
                }),
            );
            await store.dispatch(startDiscoveryThunk());
            const complete = filterThunkActionTypes(store.getActions()).pop();
            expect(complete?.type).toEqual(discoveryActions.completeDiscovery.type);
            const discovery = store.getState().wallet.discovery[0];
            const accounts = store
                .getState()
                .wallet.accounts.filter(a => discovery.networks.includes(a.symbol));

            // length of accounts in reducer are equal discovery.loaded
            expect(discovery.loaded).toEqual(accounts.length);
            // 100% progress
            expect(discovery.total).toEqual(discovery.loaded);
        });
    });

    unavailableCapabilities.forEach(f => {
        it(`Change network: ${f.description}`, () => {
            const state = getInitialState();
            if (f.device) {
                state.device.selectedDevice = f.device;
                state.device.devices = [f.device];
            }
            const store = initStore(state);
            store.dispatch(
                createDiscoveryThunk({
                    deviceState: 'device-state',
                    device: f.device || SUITE_DEVICE,
                }),
            );
            store.dispatch(walletSettingsActions.changeNetworks(f.networks as NetworkSymbol[]));
            store.dispatch(updateNetworkSettingsThunk());

            const discovery = store.getState().wallet.discovery[0];
            expect(discovery.networks).toEqual(f.discoveryNetworks);
        });
    });

    it('Start discovery without device', async () => {
        const state = {
            suite: {},
            device: {},
            wallet: {
                accounts: [],
                discovery: [],
                settings: {
                    enabledNetworks: ['btc'],
                },
            },
        };
        // @ts-expect-error: invalid state (suite empty)
        const store = initStore(state);
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        expect(action?.type).toEqual(notificationsActions.addToast.type);
    });

    it('Start discovery with device without auth confirmation', async () => {
        const state = getInitialState();
        state.device.selectedDevice = getSuiteDevice({ authConfirm: true });
        const store = initStore(state);
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        expect(action?.type).toEqual(notificationsActions.addToast.type);
    });

    it('Create discovery which already exist', () => {
        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        expect(store.getState().wallet.discovery.length).toEqual(1);
    });

    it('Start discovery which does not exist (discoveryActions test)', async () => {
        const store = initStore();
        await store.dispatch(startDiscoveryThunk());
        expect(store.getState().wallet.discovery.length).toEqual(0);
    });

    it('Start discovery which does not exist (discoveryReducer test)', () => {
        const store = initStore();
        store.dispatch({
            type: discoveryActions.startDiscovery.type,
            payload: SUITE_DEVICE,
        });
        expect(store.getState().wallet.discovery.length).toEqual(0);
    });

    it('Update discovery which does not exist', () => {
        const store = initStore();
        store.dispatch(discoveryActions.updateDiscovery({ deviceState: 'not-existed' }));
        expect(store.getState().wallet.discovery.length).toEqual(0);
    });

    it('Start/stop', done => {
        const f = new Promise<any>(resolve => {
            setTimeout(() => resolve(paramsError('discovery_interrupted')), 100);
        });
        // set fixtures in @cerberus/connect
        setCerberusConnectFixtures(f);
        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        store.dispatch(startDiscoveryThunk()).then(() => {
            const action = filterThunkActionTypes(store.getActions()).pop();
            done(expect(action?.type).toEqual(discoveryActions.stopDiscovery.type));
        });
        store.dispatch(stopDiscoveryThunk());
    });

    it('Stop discovery without device (discovery not exists)', async () => {
        const state = {
            suite: {},
            device: {},
            wallet: {
                accounts: [],
                discovery: [],
            },
        };
        // @ts-expect-error: invalid state (suite empty)
        const store = initStore(state);
        await store.dispatch(stopDiscoveryThunk());
        expect(filterThunkActionTypes(store.getActions())).toEqual([]);
    });

    it('Restart discovery (clear failed fields)', async () => {
        // fail on first account
        setCerberusConnectFixtures({
            connect: { success: true, failedAccounts: ["m/84'/0'/0'"] },
        });
        const state = getInitialState();
        const store = initStore(state);
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        // there should be one failed account
        expect(filterThunkActionTypes(store.getActions()).pop()?.type).toEqual(
            discoveryActions.completeDiscovery.type,
        );
        expect(store.getState().wallet.discovery[0].failed.length).toBeGreaterThan(0);

        // change fixtures, this time no fail
        setCerberusConnectFixtures({
            connect: { success: true },
        });
        // restart
        await store.dispatch(restartDiscoveryThunk());
        // discovery completed, no failed account
        expect(filterThunkActionTypes(store.getActions()).pop()?.type).toEqual(
            discoveryActions.completeDiscovery.type,
        );
        expect(store.getState().wallet.discovery[0].failed.length).toEqual(0);
        // remove discovery
        store.dispatch(discoveryActions.removeDiscovery('device-state'));
        // restart (discovery doesn't exists)
        await store.dispatch(restartDiscoveryThunk());
    });

    it(`CerberusConnect responded with success but discovery was removed`, async () => {
        const f = new Promise<any>(resolve => {
            setTimeout(() => resolve({ success: true }), 100);
        });
        // set fixtures in @cerberus/connect
        setCerberusConnectFixtures(f);

        const store = initStore();
        store.subscribe(() => {
            const actions = store.getActions();
            const a = actions[actions.length - 1];
            if (a.type === discoveryActions.updateDiscovery.type && a.payload.status === 1) {
                // catch bundle update called from 'start()' and remove discovery before CerberusConnect response
                store.dispatch(discoveryActions.removeDiscovery('device-state'));
            }
        });
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        expect(action?.type).toEqual(discoveryActions.removeDiscovery.type);
    });

    it(`CerberusConnect responded with success but discovery is not running`, async () => {
        const f = new Promise<any>(resolve => {
            setTimeout(() => resolve({ success: true }), 100);
        });
        // set fixtures in @cerberus/connect
        setCerberusConnectFixtures(f);

        const store = initStore();
        store.subscribe(() => {
            const actions = filterThunkActionTypes(store.getActions());
            const a = actions[actions.length - 1];
            if (a.type === discoveryActions.updateDiscovery.type && a.payload.status === 1) {
                // catch bundle update called from 'start()' and stop discovery before CerberusConnect response
                store.dispatch(
                    discoveryActions.updateDiscovery({
                        deviceState: 'device-state',
                        status: DiscoveryStatus.STOPPED,
                    }),
                );
            }
        });
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions())?.pop();
        expect(action?.type).toEqual(notificationsActions.addToast.type);
    });

    it('Discovery completed but device is not connected anymore', async () => {
        setCerberusConnectFixtures({
            connect: { success: true },
        });
        const mockedGetFeatures = jest.spyOn(CerberusConnect, 'getFeatures');
        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        // "disconnect" device
        store.getState().device.selectedDevice.connected = false;
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        expect(action?.type).toEqual(discoveryActions.completeDiscovery.type);
        // getFeatures shouldn't be called
        expect(mockedGetFeatures).toHaveBeenCalledTimes(0);
    });

    it('First iteration malformed error (not a json)', async () => {
        const f = new Promise<any>(resolve => {
            setTimeout(
                () => resolve(paramsError('not-a-json', 'Method_Discovery_BundleException')),
                100,
            );
        });
        // set fixtures in @cerberus/connect
        setCerberusConnectFixtures(f);

        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        expect(action?.type).toEqual(notificationsActions.addToast.type);
    });

    it('First iteration malformed error (invalid json not an array)', async () => {
        const f = new Promise<any>(resolve => {
            setTimeout(() => resolve(paramsError('{}', 'Method_Discovery_BundleException')), 100);
        });
        // set fixtures in @cerberus/connect
        setCerberusConnectFixtures(f);

        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        expect(action?.type).toEqual(notificationsActions.addToast.type);
    });

    it('CerberusConnect did not emit any progress event', async () => {
        jest.spyOn(CerberusConnect, 'getAccountInfo').mockImplementation(() =>
            Promise.resolve({
                success: true,
                payload: [null],
            }),
        );
        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        const result = store.getState().wallet.discovery[0];
        expect(action?.type).toEqual(discoveryActions.completeDiscovery.type);
        expect(result.loaded).toEqual(0);
    });

    it('All accounts failed in runtime', async () => {
        // set empty fixtures in @cerberus/connect, update them in custom mock below
        const { mockedGetAccountInfo, updateCerberusConnectFixtures } = setCerberusConnectFixtures();
        jest.spyOn(CerberusConnect, 'getAccountInfo').mockImplementation(params => {
            // prepare response (all failed)
            const failedAccounts = params.bundle.map(({ path }) => path as string);
            updateCerberusConnectFixtures({
                connect: {
                    success: true,
                    failedAccounts,
                },
            });

            return mockedGetAccountInfo(params);
        });

        // run process
        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        const result = store.getState().wallet.discovery[0];
        expect(action?.type).toEqual(discoveryActions.completeDiscovery.type);
        expect(result.loaded).toEqual(0);
        expect(result.total).toEqual(0);
    });

    it('All accounts failed in first iteration', async () => {
        jest.spyOn(CerberusConnect, 'getAccountInfo').mockImplementation(params => {
            // prepare json response
            const failedAccounts: any[] = [];
            for (let i = 0; i < params.bundle.length; i++) {
                failedAccounts.push({
                    index: i,
                    coin: params.bundle[i].coin,
                    exception: 'not supported',
                });
            }

            // return error
            return Promise.resolve(
                paramsError(JSON.stringify(failedAccounts), 'Method_Discovery_BundleException'),
            );
        });
        // run process
        const store = initStore();
        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: SUITE_DEVICE,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        const action = filterThunkActionTypes(store.getActions()).pop();
        const result = store.getState().wallet.discovery[0];
        expect(action?.type).toEqual(discoveryActions.completeDiscovery.type);
        expect(result.loaded).toEqual(0);
        expect(result.total).toEqual(0);
    });

    it('selectIsDiscoveryAuthConfirmationRequired', async () => {
        setCerberusConnectFixtures({
            connect: { success: true },
        });
        const state = getInitialState();
        state.device.selectedDevice = getSuiteDevice({
            state: 'device-state',
            connected: true,
            useEmptyPassphrase: false, // mandatory
        });
        const store = initStore(state);

        // Necessary workaround, as redux-mock-store, as we use it, doesn't have immutable state.
        // TODO: We should use configureMockStore from @suite-common/test-utils here
        const fn = (state: any) => selectIsDiscoveryAuthConfirmationRequired({ ...state });

        store.dispatch(
            createDiscoveryThunk({
                deviceState: 'device-state',
                device: state.device.selectedDevice,
            }),
        );
        await store.dispatch(startDiscoveryThunk());
        expect(fn(store.getState())).toEqual(true);

        // remove discovery
        store.dispatch(discoveryActions.removeDiscovery('device-state'));
        expect(fn(store.getState())).toEqual(undefined);

        // @ts-expect-error remove device from state
        store.getState().device.device = undefined;
        expect(fn(store.getState())).toEqual(undefined);
    });
});
