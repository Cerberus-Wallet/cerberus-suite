import EventEmitter from 'events';

// NOTE: @cerberus/connect part is intentionally not imported from the index
import {
    ERRORS,
    IFRAME,
    POPUP,
    WEBEXTENSION,
    createErrorMessage,
    ConnectSettings,
    Manifest,
    CallMethod,
} from '@cerberus/connect/lib/exports';
import { factory } from '@cerberus/connect/lib/factory';
import { WindowServiceWorkerChannel } from '@cerberus/connect-web/lib/channels/window-serviceworker';

const eventEmitter = new EventEmitter();
let _channel: any;

const manifest = (data: Manifest) => {
    if (_channel) {
        _channel.postMessage({
            type: POPUP.INIT,
            payload: {
                settings: { manifest: data },
            },
        });
    }

    return Promise.resolve(undefined);
};

const dispose = () => {
    eventEmitter.removeAllListeners();

    return Promise.resolve(undefined);
};

const cancel = () => {
    if (_channel) {
        _channel.clear();
    }
};

const init = (settings: Partial<ConnectSettings> = {}): Promise<void> => {
    if (!_channel) {
        _channel = new WindowServiceWorkerChannel({
            name: 'cerberus-connect-proxy',
            channel: {
                here: '@cerberus/connect-foreground-proxy',
                peer: '@cerberus/connect-service-worker-proxy',
            },
        });
    }

    _channel.port.onMessage.addListener((message: any) => {
        if (message.type === WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM) {
            eventEmitter.emit(WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM, message);
        }
    });

    return _channel.init().then(() =>
        _channel.postMessage(
            {
                type: POPUP.INIT,
                payload: { settings },
            },
            { usePromise: false },
        ),
    );
};

const call: CallMethod = async (params: any) => {
    try {
        const response = await _channel.postMessage({
            type: IFRAME.CALL,
            payload: params,
        });
        if (response) {
            return response;
        }

        return createErrorMessage(ERRORS.TypedError('Method_NoResponse'));
    } catch (error) {
        _channel.clear();

        return createErrorMessage(error);
    }
};

const uiResponse = () => {
    // Not needed here.
    throw ERRORS.TypedError('Method_InvalidPackage');
};

const renderWebUSBButton = () => {
    // Not needed here - webUSB pairing happens in popup.
    throw ERRORS.TypedError('Method_InvalidPackage');
};

const requestLogin = () => {
    // Not needed here - Not used here.
    throw ERRORS.TypedError('Method_InvalidPackage');
};

const disableWebUSB = () => {
    // Not needed here - webUSB pairing happens in popup.
    throw ERRORS.TypedError('Method_InvalidPackage');
};

const requestWebUSBDevice = () => {
    // Not needed here - webUSB pairing happens in popup.
    throw ERRORS.TypedError('Method_InvalidPackage');
};

const CerberusConnect = factory({
    eventEmitter,
    manifest,
    init,
    call,
    requestLogin,
    uiResponse,
    renderWebUSBButton,
    disableWebUSB,
    requestWebUSBDevice,
    cancel,
    dispose,
});

// eslint-disable-next-line import/no-default-export
export default CerberusConnect;
export * from '@cerberus/connect/lib/exports';
