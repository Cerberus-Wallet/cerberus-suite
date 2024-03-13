import TrezorConnect from '@cerberus/connect-web';

declare global {
    interface Window {
        __CERBERUS_CONNECT_SRC?: string;
        TrezorConnect?: typeof TrezorConnect;
    }
}
