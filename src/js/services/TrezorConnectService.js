/* @flow */
'use strict';

import { push } from 'react-router-redux';

import TrezorConnect, { TRANSPORT, DEVICE_EVENT, UI_EVENT, UI, DEVICE } from 'trezor-connect';
import * as TrezorConnectActions from '../actions/TrezorConnectActions';
import * as DiscoveryActions from '../actions/DiscoveryActions';
import * as ModalActions from '../actions/ModalActions';
import { init as initWeb3 } from '../actions/Web3Actions';
import * as WEB3 from '../actions/constants/web3';
import * as STORAGE from '../actions/constants/localStorage';
import * as CONNECT from '../actions/constants/TrezorConnect';
import * as NOTIFICATION from '../actions/constants/notification';
import * as MODAL from '../actions/constants/modal';

import type { 
    Middleware,
    MiddlewareAPI,
    MiddlewareDispatch,
    State,
    Dispatch,
    Action,
    AsyncAction,
    GetState,
    RouterLocationState
} from '../flowtype';

const TrezorConnectService: Middleware = (api: MiddlewareAPI) => (next: MiddlewareDispatch) => (action: Action): Action => {

    const prevState: $ElementType<State, 'connect'> = api.getState().connect;
    const prevModalState: $ElementType<State, 'modal'> = api.getState().modal;
    const prevRouterState: $ElementType<State, 'router'> = api.getState().router;

    next(action);

    if (action.type === STORAGE.READY) {
        api.dispatch( TrezorConnectActions.init() );

    } else if (action.type === TRANSPORT.ERROR) {
        // TODO: check if modal is open
        // api.dispatch( push('/') );
    } else if (action.type === TRANSPORT.START && api.getState().web3.length < 1) {
        api.dispatch( initWeb3() );
    } else if (action.type === WEB3.READY) {
        api.dispatch( TrezorConnectActions.postInit() );
    } else if (action.type === TRANSPORT.UNREADABLE) {
        api.dispatch({
            type: NOTIFICATION.ADD,
            payload: {
                type: 'error',
                title: 'Unreadable HID device',
                message: '',
                cancelable: true,
            }
        });
    } else if (action.type === DEVICE.DISCONNECT) {
        api.dispatch( TrezorConnectActions.deviceDisconnect(action.device) );

    } else if (action.type === CONNECT.REMEMBER_REQUEST) {

        api.dispatch(ModalActions.onRememberRequest(prevModalState));

    } else if (action.type === CONNECT.FORGET) {
        //api.dispatch( TrezorConnectActions.forgetDevice(action.device) );
        api.dispatch( TrezorConnectActions.switchToFirstAvailableDevice() );
    } else if (action.type === CONNECT.FORGET_SINGLE) {
        if (api.getState().connect.devices.length < 1 && action.device.connected) {
            // prompt disconnect device info in LandingPage
            api.dispatch({
                type: CONNECT.DISCONNECT_REQUEST,
                device: action.device
            });
            api.dispatch( push('/') );
        } else {
            api.dispatch( TrezorConnectActions.switchToFirstAvailableDevice() );
        }
    } else if (action.type === DEVICE.CHANGED) {
        // selected device was previously unacquired, but now it's acquired
        // we need to change route 
        if (prevState.selectedDevice) {
            if (!action.device.unacquired && action.device.path === prevState.selectedDevice.id) {
                api.dispatch( TrezorConnectActions.onSelectDevice(action.device) );
            }
        }
    } else if (action.type === DEVICE.CONNECT || action.type === DEVICE.CONNECT_UNACQUIRED) {

        api.dispatch( DiscoveryActions.restore() );

        // interrupt process of remembering device (force forget)
        // TODO: the same for disconnect more than 1 device at once
        // TODO: move it to modal actions
        const { modal } = api.getState();
        if (modal.opened && modal.windowType === CONNECT.REMEMBER_REQUEST) {
            if (action.device.features && modal.device && modal.device.features && modal.device.features.device_id === action.device.features.device_id) {
                api.dispatch({
                    type: MODAL.CLOSE,
                });
            } else {
                api.dispatch({
                    type: CONNECT.FORGET,
                    device: modal.device
                });
            }
        }

    } else if (action.type === CONNECT.AUTH_DEVICE) {
        api.dispatch( DiscoveryActions.check() );
    } else if (action.type === CONNECT.DUPLICATE) {
        api.dispatch( TrezorConnectActions.selectDuplicatedDevice() );
    } else if (action.type === CONNECT.ACQUIRED || action.type === CONNECT.SELECT_DEVICE) {
        api.dispatch( TrezorConnectActions.getSelectedDeviceState() );
    } else if (action.type === CONNECT.COIN_CHANGED) {
        api.dispatch( TrezorConnectActions.coinChanged( action.payload.network ) );
    }

    return action;
}

export default TrezorConnectService;