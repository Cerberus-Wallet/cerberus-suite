import CerberusConnect from '../../../src';

// error thrown by .init()
const INIT_ERROR = { code: 'Init_ManifestMissing' };

describe('CerberusConnect.init', () => {
    afterEach(async () => {
        await CerberusConnect.dispose();
    });

    beforeAll(() => {
        // use local build, not cerberus connect version hosted on cerberus.connect.io
        // @ts-expect-error
        global.__CERBERUS_CONNECT_SRC = process.env.CERBERUS_CONNECT_SRC;
    });

    it('calling method before .init() and/or .manifest()', async () => {
        const { payload } = await CerberusConnect.getCoinInfo({ coin: 'btc' });
        expect(payload).toMatchObject(INIT_ERROR);
    });

    it('missing manifest in CerberusConnect.init', async () => {
        try {
            // @ts-expect-error
            await CerberusConnect.init();
            throw new Error('Should not be resolved');
        } catch (error) {
            expect(error).toMatchObject(INIT_ERROR);
        }
    });

    it('invalid manifest in CerberusConnect.init', async () => {
        try {
            // @ts-expect-error
            await CerberusConnect.init({ manifest: {} });
            throw new Error('Should not be resolved');
        } catch (error) {
            expect(error).toMatchObject(INIT_ERROR);
        }
    });

    it('calling .init() multiple times', async () => {
        await CerberusConnect.init({
            manifest: { appUrl: 'a', email: 'b' },
        });

        try {
            await CerberusConnect.init({ manifest: { appUrl: 'a', email: 'b' } });
            throw new Error('Should not be resolved');
        } catch (error) {
            expect(error).toMatchObject({ code: 'Init_AlreadyInitialized' });
        }
    });

    it('init success', async () => {
        await CerberusConnect.init({ manifest: { appUrl: 'a', email: 'b' } });

        const resp = await CerberusConnect.getCoinInfo({ coin: 'btc' });
        expect(resp).toMatchObject({
            payload: { type: 'bitcoin', shortcut: 'BTC' },
        });
    });

    it('manifest success', async () => {
        CerberusConnect.manifest({
            appUrl: 'a',
            email: 'b',
        });
        const resp = await CerberusConnect.getCoinInfo({ coin: 'btc' });
        expect(resp).toMatchObject({
            payload: { type: 'bitcoin', shortcut: 'BTC' },
        });
    });
});
