import { getDefaultBackendType, isCerberusConnectBackendType } from '../backendUtils';

describe('backend utils', () => {
    test('getDefaultBackendType', () => {
        expect(getDefaultBackendType('btc')).toBe('blockbook');
        expect(getDefaultBackendType('ltc')).toBe('blockbook');
        expect(getDefaultBackendType('ada')).toBe('blockfrost');
        expect(getDefaultBackendType('tada')).toBe('blockfrost');
    });

    test('isCerberusConnectBackendType', () => {
        expect(isCerberusConnectBackendType()).toBe(true);
        expect(isCerberusConnectBackendType('blockbook')).toBe(true);
        expect(isCerberusConnectBackendType('coinjoin')).toBe(false);
        // @ts-expect-error
        expect(isCerberusConnectBackendType('gibberish')).toBe(false);
        // @ts-expect-error
        expect(isCerberusConnectBackendType({})).toBe(false);
    });
});
