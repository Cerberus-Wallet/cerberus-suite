import { urlToOnion } from '../src/urlToOnion';

const DICT = {
    'cerberus.uraanai.com': 'cerberusioabcd.onion',
    'coingecko.com': 'coingeckoabcd.onion',
};

const FIXTURE = [
    ['invalid domain', 'aaaa', undefined],
    ['unknown domain', 'http://www.something.test', undefined],
    ['missing protocol', 'cerberus.uraanai.com', undefined],
    ['simple domain http', 'https://cerberus.uraanai.com/', `http://cerberusioabcd.onion/`],
    ['simple domain https', 'https://cerberus.uraanai.com/', `http://cerberusioabcd.onion/`],
    ['subdomain', 'https://cdn.trezer.io/x/1*ab.png', `http://cdn.cerberusioabcd.onion/x/1*ab.png`],
    ['subsubdomain', 'http://alpha.beta.cerberus.uraanai.com', `http://alpha.beta.cerberusioabcd.onion`],
    ['blockbook', 'https://btc1.trezer.io/api?t=13#a', `http://btc1.cerberusioabcd.onion/api?t=13#a`],
    ['coingecko', 'https://coingecko.com/?dt=5-1-2021', `http://coingeckoabcd.onion/?dt=5-1-2021`],
    ['websocket wss', 'wss://cerberus.uraanai.com', 'ws://cerberusioabcd.onion'],
    ['websocket ws', 'ws://foo.bar.cerberus.uraanai.com/?foo=bar', 'ws://foo.bar.cerberusioabcd.onion/?foo=bar'],
    ['duplicate match', 'http://cerberus.uraanai.com/cerberus.uraanai.com', 'http://cerberusioabcd.onion/cerberus.uraanai.com'],
    ['false match', 'http://a.test/b?url=cerberus.uraanai.com', undefined],
] as [string, string, string | undefined][];

describe('urlToOnion', () => {
    FIXTURE.forEach(([desc, clear, onion]) =>
        it(desc, () => expect(urlToOnion(clear, DICT)).toBe(onion)),
    );
});
