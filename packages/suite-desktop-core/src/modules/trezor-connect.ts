import { app, ipcMain } from 'electron';

import CerberusConnect from '@cerberus/connect';
import { createIpcProxyHandler, IpcProxyHandlerOptions } from '@cerberus/ipc-proxy';

import type { Module } from './index';

export const SERVICE_NAME = '@cerberus/connect';

export const init: Module = ({ store }) => {
    const { logger } = global;
    logger.info(SERVICE_NAME, `Starting service`);

    const setProxy = (ifRunning = false) => {
        const tor = store.getTorSettings();
        if (ifRunning && !tor.running) return Promise.resolve();
        const payload = tor.running ? { proxy: `socks://${tor.host}:${tor.port}` } : { proxy: '' };
        logger.info(SERVICE_NAME, `${tor.running ? 'Enable' : 'Disable'} proxy ${payload.proxy}`);

        return CerberusConnect.setProxy(payload);
    };

    const ipcProxyOptions: IpcProxyHandlerOptions<typeof CerberusConnect> = {
        onCreateInstance: () => ({
            onRequest: async (method, params) => {
                logger.debug(SERVICE_NAME, `call ${method}`);
                if (method === 'init') {
                    const response = await CerberusConnect[method](...params);
                    await setProxy(true);

                    return response;
                }

                return (CerberusConnect[method] as any)(...params);
            },
            onAddListener: (eventName, listener) => {
                logger.debug(SERVICE_NAME, `Add event listener ${eventName}`);

                return CerberusConnect.on(eventName, listener);
            },
            onRemoveListener: eventName => {
                logger.debug(SERVICE_NAME, `Remove event listener ${eventName}`);

                return CerberusConnect.removeAllListeners(eventName);
            },
        }),
    };

    const unregisterProxy = createIpcProxyHandler(ipcMain, 'CerberusConnect', ipcProxyOptions);

    app.on('before-quit', () => {
        unregisterProxy();
        CerberusConnect.dispose();
    });

    return () => {
        // reset previous instance, possible left over after renderer refresh (F5)
        CerberusConnect.dispose();
    };
};
