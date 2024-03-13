import { contextBridge, ipcRenderer } from 'electron';

import { exposeIpcProxy } from '@cerberus/ipc-proxy';
import { getDesktopApi } from '@cerberus/suite-desktop-api';

import '@sentry/electron/preload'; // With this only IPCMode.Classic is ever taken into account

contextBridge.exposeInMainWorld(
    ...exposeIpcProxy(ipcRenderer, ['TrezorConnect', 'CoinjoinBackend', 'CoinjoinClient']),
);

const desktopApi = getDesktopApi(ipcRenderer);
contextBridge.exposeInMainWorld('desktopApi', desktopApi);
