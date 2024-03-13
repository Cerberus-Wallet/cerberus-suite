import CerberusConnect from '@cerberus/connect-web';

declare global {
    interface Window {
        __CERBERUS_CONNECT_SRC?: string;
        CerberusConnect?: typeof CerberusConnect;
    }
}
