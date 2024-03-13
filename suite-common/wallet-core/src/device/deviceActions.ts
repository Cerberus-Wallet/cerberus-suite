import { createAction } from '@reduxjs/toolkit';

import { Device, DEVICE } from '@cerberus/connect';
import { ButtonRequest, CerberusDevice } from '@suite-common/suite-types';

export const MODULE_PREFIX = '@suite/device';

const connectDevice = createAction(DEVICE.CONNECT, (payload: Device) => ({ payload }));

const connectUnacquiredDevice = createAction(DEVICE.CONNECT_UNACQUIRED, (payload: Device) => ({
    payload,
}));

const deviceChanged = createAction(DEVICE.CHANGED, (payload: Device | CerberusDevice) => ({
    payload,
}));

const deviceDisconnect = createAction(DEVICE.DISCONNECT, (payload: Device) => ({ payload }));

const updatePassphraseMode = createAction(
    `${MODULE_PREFIX}/updatePassphraseMode`,
    (payload: { device: CerberusDevice; hidden: boolean; alwaysOnDevice?: boolean }) => ({ payload }),
);

const authFailed = createAction(`${MODULE_PREFIX}/authFailed`, (payload: CerberusDevice) => ({
    payload,
}));

const receiveAuthConfirm = createAction(
    `${MODULE_PREFIX}/receiveAuthConfirm`,
    (payload: { device: CerberusDevice; success: boolean }) => ({ payload }),
);

const createDeviceInstance = createAction(
    `${MODULE_PREFIX}/createDeviceInstance`,
    (payload: CerberusDevice) => ({ payload }),
);

const rememberDevice = createAction(
    `${MODULE_PREFIX}/rememberDevice`,
    (payload: { device: CerberusDevice; remember: boolean; forceRemember: undefined | true }) => ({
        payload,
    }),
);

const forgetDevice = createAction(`${MODULE_PREFIX}/forgetDevice`, (payload: CerberusDevice) => ({
    payload,
}));

const authDevice = createAction(
    `${MODULE_PREFIX}/authDevice`,
    (payload: { device: CerberusDevice; state: string }) => ({ payload }),
);

const addButtonRequest = createAction(
    `${MODULE_PREFIX}/addButtonRequest`,
    (payload: { device?: CerberusDevice; buttonRequest?: ButtonRequest }) => ({ payload }),
);

const requestDeviceReconnect = createAction(`${MODULE_PREFIX}/requestDeviceReconnect`);

const selectDevice = createAction(`${MODULE_PREFIX}/selectDevice`, (payload?: CerberusDevice) => ({
    payload,
}));

const updateSelectedDevice = createAction(
    `${MODULE_PREFIX}/updateSelectedDevice`,
    (payload?: CerberusDevice) => ({ payload }),
);

export const removeButtonRequests = createAction(
    addButtonRequest.type,
    ({ device }: { device: CerberusDevice | null }) => ({
        payload: {
            device,
        },
    }),
);

export const forgetAndDisconnectDevice = createAction(
    `${MODULE_PREFIX}/forgetAndDisconnectDevice`,
    (payload: CerberusDevice) => ({
        payload,
    }),
);

export const deviceActions = {
    connectDevice,
    connectUnacquiredDevice,
    deviceChanged,
    deviceDisconnect,
    updatePassphraseMode,
    authFailed,
    receiveAuthConfirm,
    createDeviceInstance,
    rememberDevice,
    forgetDevice,
    authDevice,
    addButtonRequest,
    requestDeviceReconnect,
    selectDevice,
    updateSelectedDevice,
    removeButtonRequests,
    forgetAndDisconnectDevice,
};
