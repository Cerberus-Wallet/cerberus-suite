import { parseConnectSettings } from '../src/connectSettings';

declare let window: any; // Window['location'] types doesn't allow location mocks

describe('connect-web parseConnectSettings', () => {
    const { location } = window;
    beforeEach(() => {
        delete window.location;
        window.location = {
            protocol: 'https:',
            hostname: 'connect.cerberus.uraanai.com',
            href: 'https://connect.cerberus.uraanai.com',
            toString: () => 'https://connect.cerberus.uraanai.com',
        };
    });
    afterAll(() => {
        window.location = location; // restore default
    });

    it('parseConnectSettings: connect src in location.search', () => {
        window.location = { search: 'trezor-connect-src=https://connect.cerberus.uraanai.com/beta.1/' };
        expect(parseConnectSettings({}).connectSrc).toEqual('https://connect.cerberus.uraanai.com/beta.1/');

        window.location = {
            search: 'foo=bar&trezor-connect-src=https://connect.cerberus.uraanai.com/beta.2/',
        };
        expect(parseConnectSettings({}).connectSrc).toEqual('https://connect.cerberus.uraanai.com/beta.2/');

        window.location = {
            search: 'trezor-connect-src=https://connect.cerberus.uraanai.com/beta.3/&foo=bar',
        };
        expect(parseConnectSettings({}).connectSrc).toEqual('https://connect.cerberus.uraanai.com/beta.3/');

        window.location = {
            search: 'trezor-connect-src=https%3A%2F%2Fconnect.cerberus.uraanai.com%2Fbeta.encoded%2F',
        }; // encoded
        expect(parseConnectSettings({}).connectSrc).toEqual(
            'https://connect.cerberus.uraanai.com/beta.encoded/',
        );

        window.location = { search: 'trezor-connect-src=https://connect-beta.trezor.oi/beta.3/' }; // invalid domain "io"
        expect(parseConnectSettings({}).connectSrc).toEqual(undefined);
    });

    it('parseConnectSettings: connect src in window/global scope', () => {
        window.__CERBERUS_CONNECT_SRC = 'https://connect.cerberus.uraanai.com/beta.4/';
        expect(parseConnectSettings({}).connectSrc).toEqual('https://connect.cerberus.uraanai.com/beta.4/');

        window.__CERBERUS_CONNECT_SRC = 'https://connect-beta.trezor.oi/beta.4/'; // invalid domain
        expect(parseConnectSettings({}).connectSrc).toEqual(undefined);

        delete window.__CERBERUS_CONNECT_SRC; // restore

        // @ts-expect-error
        global.window = undefined;
        // @ts-expect-error
        global.__CERBERUS_CONNECT_SRC = 'https://connect.cerberus.uraanai.com/beta.5/';
        expect(parseConnectSettings({}).connectSrc).toEqual('https://connect.cerberus.uraanai.com/beta.5/');
        // @ts-expect-error
        delete global.__CERBERUS_CONNECT_SRC; // restore
    });
});
