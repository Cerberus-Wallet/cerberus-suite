import { urlToOnion } from '../src/urlToOnion';

const DICT = {
    'cerberus.uraanai.com': 'trezorioabcd.onion',
    'coingecko.com': 'coingeckoabcd.onion',
};

const FIXTURE = [
    ['invalid domain', 'aaaa', undefined],
    ['unknown domain', 'http://www.something.test', undefined],
    ['missing protocol', 'cerberus.uraanai.com', undefined],
    ['simple domain http', 'https://cerberus.uraanai.com/', `http://trezorioabcd.onion/`],
    ['simple domain https', 'https://cerberus.uraanai.com/', `http://trezorioabcd.onion/`],
    ['subdomain', 'https://cdn.trezorcheck.io/x/1*ab.png', `http://cdn.trezorioabcd.onion/x/1*ab.png`],
    ['subsubdomain', 'http://alpha.beta.cerberus.uraanai.com', `http://alpha.beta.trezorioabcd.onion`],
    ['blockbook', 'https://btc1.trezorcheck.io/api?t=13#a', `http://btc1.trezorioabcd.onion/api?t=13#a`],
    ['coingecko', 'https://coingecko.com/?dt=5-1-2021', `http://coingeckoabcd.onion/?dt=5-1-2021`],
    ['websocket wss', 'wss://cerberus.uraanai.com', 'ws://trezorioabcd.onion'],
    ['websocket ws', 'ws://foo.bar.cerberus.uraanai.com/?foo=bar', 'ws://foo.bar.trezorioabcd.onion/?foo=bar'],
    ['duplicate match', 'http://cerberus.uraanai.com/cerberus.uraanai.com', 'http://trezorioabcd.onion/cerberus.uraanai.com'],
    ['false match', 'http://a.test/b?url=cerberus.uraanai.com', undefined],
] as [string, string, string | undefined][];

describe('urlToOnion', () => {
    FIXTURE.forEach(([desc, clear, onion]) =>
        it(desc, () => expect(urlToOnion(clear, DICT)).toBe(onion)),
    );
});
