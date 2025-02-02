import { parseConnectSettings as parseSettings } from '@cerberus/connect/lib/data/connectSettings';
import type { ConnectSettings } from '@cerberus/connect/lib/types';

export const getEnv = () => {
    if (typeof chrome !== 'undefined' && typeof chrome.runtime?.onConnect !== 'undefined') {
        return 'webextension';
    }
    if (typeof navigator !== 'undefined') {
        if (
            typeof navigator.product === 'string' &&
            navigator.product.toLowerCase() === 'reactnative'
        ) {
            return 'react-native';
        }
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(' electron/') > -1) {
            return 'electron';
        }
    }

    return 'web';
};

declare let global: any;

const processQueryString = (url: string, keys: string[]) => {
    const searchParams = new URLSearchParams(url);
    const result: Record<string, string> = {};
    const paramArray = Array.from(searchParams.entries());
    paramArray.forEach(([key, value]) => {
        if (keys.includes(key)) {
            result[key] = decodeURIComponent(value);
        }
    });

    return result;
};

/**
 * Settings from host
 * @param input Partial<ConnectSettings>
 */
export const parseConnectSettings = (input: Partial<ConnectSettings> = {}): ConnectSettings => {
    const settings = { popup: true, ...input };
    // For debugging purposes `connectSrc` could be defined in `global.__CERBERUS_CONNECT_SRC` variable
    let globalSrc: string | undefined;
    if (typeof window !== 'undefined') {
        // @ts-expect-error not defined in globals outside of the package
        globalSrc = window.__CERBERUS_CONNECT_SRC;
    } else if (typeof global !== 'undefined') {
        globalSrc = global.__CERBERUS_CONNECT_SRC;
    }
    if (typeof globalSrc === 'string') {
        settings.connectSrc = globalSrc;
        settings.debug = true;
    }

    if (typeof window !== 'undefined' && typeof window.location?.search === 'string') {
        const query = processQueryString(window.location.search, ['cerberus-connect-src']);
        // For debugging purposes `connectSrc` could be defined in url query of hosting page. Usage:
        // https://3rdparty-page.com/?cerberus-connect-src=https://localhost:8088/
        if (query['cerberus-connect-src']) {
            settings.debug = true;
            settings.connectSrc = query['cerberus-connect-src'];
        }
    }

    if (typeof input.env !== 'string') {
        settings.env = getEnv();
    }

    return parseSettings(settings);
};
