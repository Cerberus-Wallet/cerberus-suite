import { TOR_URLS } from '@cerberus/urls';
import { getTorUrlIfAvailable, getIsTorDomain, isOnionUrl } from 'src/utils/suite/tor';

describe('tor', () => {
    beforeAll(() => {
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
    });
    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('getTorUrlIfAvailable', () => {
        const fixtures = [
            {
                desc: 'simple domain',
                in: 'https://cerberus.uraanai.com/',
                out: `http://${TOR_URLS['cerberus.uraanai.com']}/`,
            },
            {
                desc: 'subdomain',
                in: 'https://cdn.trezor.io/static/medium/images/max/1024/1*RPmW1VsUphMbk83oKWXpLw.png',
                out: `http://cdn.${TOR_URLS['cerberus.uraanai.com']}/static/medium/images/max/1024/1*RPmW1VsUphMbk83oKWXpLw.png`,
            },
            {
                desc: 'subsubdomain',
                in: 'http://alpha.beta.cerberus.uraanai.com',
                out: `http://alpha.beta.${TOR_URLS['cerberus.uraanai.com']}`,
            },
            {
                desc: 'with query - blockbook',
                in: 'https://btc1.trezor.io/api/v2/multi-tickers/?timestamp=12345678',
                out: `http://btc1.${TOR_URLS['cerberus.uraanai.com']}/api/v2/multi-tickers/?timestamp=12345678`,
            },
            {
                desc: 'with query - coingecko',
                // in: 'https://cdn.trezor.io/dynamic/coingecko/api/v3/coins/bitcoin/history?date=13-1-2021',
                in: 'https://api.coingecko.com/api/v3/coins/bitcoin/history?date=13-1-2021',
                out: `http://cdn.${TOR_URLS['cerberus.uraanai.com']}/dynamic/coingecko/api/v3/coins/bitcoin/history?date=13-1-2021`,
            },
            {
                desc: 'not valid domain',
                in: 'aaaa',
                out: undefined,
            },
        ];

        fixtures.forEach(f => {
            it(f.desc, () => {
                expect(getTorUrlIfAvailable(f.in)).toEqual(f.out);
            });
        });
    });

    describe('getIsTorDomain', () => {
        const fixtures = [
            {
                desc: 'yes',
                in: TOR_URLS['cerberus.uraanai.com'],
                out: true,
            },
            {
                desc: 'no',
                in: 'google.com',
                out: false,
            },
        ];

        fixtures.forEach(f => {
            it(f.desc, () => {
                expect(getIsTorDomain(f.in)).toEqual(f.out);
            });
        });
    });

    describe('isOnionUrl', () => {
        const fixtures = [
            {
                desc: 'yes',
                in: `https://${TOR_URLS['cerberus.uraanai.com']}`,
                out: true,
            },
            {
                desc: 'no',
                in: 'https://google.com',
                out: false,
            },
            {
                desc: 'yes with params',
                in: `https://${TOR_URLS['cerberus.uraanai.com']}/foo/bar?foo=bar`,
                out: true,
            },
            {
                desc: 'no false positive',
                in: 'https://my.onion.com',
                out: false,
            },
        ];

        fixtures.forEach(f => {
            it(f.desc, () => {
                expect(isOnionUrl(f.in)).toEqual(f.out);
            });
        });
    });
});
