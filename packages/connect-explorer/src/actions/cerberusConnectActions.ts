import CerberusConnect, {
    DEVICE,
    DEVICE_EVENT,
    TRANSPORT_EVENT,
    WEBEXTENSION,
} from '@cerberus/connect-web';

import { CerberusConnectDevice, Dispatch, Field, GetState } from '../types';
import * as ACTIONS from './index';

type ConnectOptions = Parameters<(typeof CerberusConnect)['init']>[0];
export type CerberusConnectAction =
    | { type: typeof ACTIONS.ON_SELECT_DEVICE; path: string }
    | { type: typeof DEVICE.CONNECT; device: CerberusConnectDevice }
    | { type: typeof DEVICE.CONNECT_UNACQUIRED; device: CerberusConnectDevice }
    | { type: typeof DEVICE.DISCONNECT; device: CerberusConnectDevice }
    | { type: typeof ACTIONS.ON_CHANGE_CONNECT_OPTIONS; payload: ConnectOptions }
    | { type: typeof ACTIONS.ON_HANDSHAKE_CONFIRMED }
    | {
          type: typeof ACTIONS.ON_CHANGE_CONNECT_OPTION;
          payload: { option: Field<any>; value: any };
      };

export function onSelectDevice(path: string) {
    return {
        type: ACTIONS.ON_SELECT_DEVICE,
        path,
    };
}

export const onConnectOptionChange = (option: string, value: any) => ({
    type: ACTIONS.ON_CHANGE_CONNECT_OPTION,
    payload: {
        option,
        value,
    },
});

export const init =
    (options: Partial<Parameters<(typeof CerberusConnect)['init']>[0]> = {}) =>
    async (dispatch: Dispatch) => {
        window.CerberusConnect = CerberusConnect;

        // The event `WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM` is coming from @cerberus/connect-webextension/proxy
        // that is replacing @cerberus/connect-web when connect-explorer is run in connect-explorer-webextension
        // so Typescript cannot recognize it.
        (CerberusConnect.on as any)(WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM, event => {
            if (event.type === WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM) {
                dispatch({ type: ACTIONS.ON_HANDSHAKE_CONFIRMED });
            }
        });

        CerberusConnect.on(DEVICE_EVENT, event => {
            dispatch({
                type: event.type,
                device: event.payload,
            });
        });

        CerberusConnect.on(TRANSPORT_EVENT, _event => {
            // this type of event should not be emitted in "popup mode"
        });

        const { host } = window.location;

        if (process?.env?.__CERBERUS_CONNECT_SRC && host !== 'connect.cerberus.uraanai.com') {
            window.__CERBERUS_CONNECT_SRC = process?.env?.__CERBERUS_CONNECT_SRC;
        }
        // yarn workspace @cerberus/connect-explorer dev starts @cerberus/connect-web on localhost port
        // so we may use it
        if (!window.__CERBERUS_CONNECT_SRC && host.startsWith('localhost')) {
            // use local connect for local development
            window.__CERBERUS_CONNECT_SRC = `${window.location.origin}/`;
        }

        if (options.connectSrc) {
            window.__CERBERUS_CONNECT_SRC = options.connectSrc;
        }

        if (!window.__CERBERUS_CONNECT_SRC) {
            console.log('using production @cerberus/connect');
        } else {
            console.log('using @cerberus/connect hosted on: ', window.__CERBERUS_CONNECT_SRC);
        }

        const connectOptions = {
            transportReconnect: true,
            popup: true,
            debug: true,
            lazyLoad: true,
            manifest: {
                email: 'info@cerberus.uraanai.com',
                appUrl: '@cerberus/suite',
            },
            trustedHost: false,
            ...options,
        };

        try {
            await CerberusConnect.init(connectOptions);
        } catch (err) {
            console.log('ERROR', err);

            return;
        }

        dispatch({ type: ACTIONS.ON_CHANGE_CONNECT_OPTIONS, payload: connectOptions });
    };

export const onSubmitInit = () => async (dispatch: Dispatch, getState: GetState) => {
    const { connect } = getState();
    // Disposing CerberusConnect to init it again.
    await CerberusConnect.dispose();

    return dispatch(init(connect.options));
};
