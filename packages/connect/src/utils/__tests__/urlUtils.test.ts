import { getOrigin, getHost, getOnionDomain } from '../urlUtils';

describe('utils/urlUtils', () => {
    it('getOrigin', () => {
        expect(getOrigin('file://index.html')).toEqual('file://');
        expect(getOrigin('https://cerberus.uraanai.com')).toEqual('https://cerberus.uraanai.com');
        expect(getOrigin('https://connect.cerberus.uraanai.com')).toEqual('https://connect.cerberus.uraanai.com');
        expect(getOrigin('https://foo.connect.cerberus.uraanai.com/9/?query=1#hash2')).toEqual(
            'https://foo.connect.cerberus.uraanai.com',
        );

        expect(getOrigin(undefined)).toEqual('unknown');
        expect(getOrigin(null)).toEqual('unknown');
        expect(getOrigin({})).toEqual('unknown');
    });

    it('getHost', () => {
        expect(getHost('http://localhost:8088/')).toEqual('localhost');
        expect(getHost('file://index.html')).toEqual(undefined);
        expect(getHost('https://cerberus.uraanai.com')).toEqual('cerberus.uraanai.com');
        expect(getHost('https://connect.cerberus.uraanai.com')).toEqual('cerberus.uraanai.com');
        expect(getHost('https://foo.connect.cerberus.uraanai.com/9/?query=1#hash2')).toEqual('cerberus.uraanai.com');

        expect(getHost(undefined)).toEqual(undefined);
        expect(getHost(null)).toEqual(undefined);
        expect(getHost({})).toEqual(undefined);
    });

    it('getOnionDomain', () => {
        const dict = {
            'cerberus.uraanai.com': 'cerberus.onion',
        };
        // expect(getOnionDomain('cerberus.uraanai.com', dict)).toEqual('cerberus.uraanai.com');
        expect(getOnionDomain('https://cerberus.uraanai.com', dict)).toEqual('http://cerberus.onion');
        expect(getOnionDomain('http://cerberus.uraanai.com', dict)).toEqual('http://cerberus.onion');
        expect(getOnionDomain('http://connect.cerberus.uraanai.com', dict)).toEqual(
            'http://connect.cerberus.onion',
        );
        expect(getOnionDomain('http://foo.bar.connect.cerberus.uraanai.com/9/?query=1#hash2', dict)).toEqual(
            'http://foo.bar.connect.cerberus.onion/9/?query=1#hash2',
        );
        expect(getOnionDomain('wss://cerberus.uraanai.com', dict)).toEqual('ws://cerberus.onion');
        expect(getOnionDomain('ws://foo.bar.cerberus.uraanai.com/?foo=bar', dict)).toEqual(
            'ws://foo.bar.cerberus.onion/?foo=bar',
        );
    });
});
