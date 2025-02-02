import { TypedError } from './constants/errors';
import { factory } from './factory';

// Throw error from each method. use @cerberus/connect-web instead.
const fallback = () => {
    throw TypedError('Method_InvalidPackage');
};

const CerberusConnect = factory({
    eventEmitter: {
        on: fallback,
        off: fallback,
        removeAllListeners: fallback,
        listenerCount: fallback,
    } as any,
    manifest: fallback,
    init: fallback,
    call: fallback,
    requestLogin: fallback,
    requestWebUSBDevice: fallback,
    uiResponse: fallback,
    renderWebUSBButton: fallback,
    disableWebUSB: fallback,
    cancel: fallback,
    dispose: fallback,
});

export default CerberusConnect;
export * from './exports';
