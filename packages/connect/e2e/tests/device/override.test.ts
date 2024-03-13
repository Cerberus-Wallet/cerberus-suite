import CerberusConnect from '../../../src';

const { getController, setup, initCerberusConnect } = global.Cerberus;

const controller = getController('setBusy');

describe('CerberusConnect override param', () => {
    beforeEach(async () => {
        await CerberusConnect.dispose();
        await setup(controller, {
            mnemonic: 'mnemonic_all',
        });
        await initCerberusConnect(controller);
    });

    afterAll(async () => {
        controller.dispose();
        await CerberusConnect.dispose();
    });

    for (const delay of [1, 10, 100, 300, 500, 1000, 1500]) {
        it(`override previous call after ${delay}ms`, async () => {
            CerberusConnect.removeAllListeners();

            CerberusConnect.getAddress({
                path: "m/44'/1'/0'/0/0",
                showOnCerberus: true,
            }).then(response => {
                expect(response.success).toBe(false);
                expect(response.payload).toMatchObject({ code: 'Method_Override' });
            });

            await new Promise(resolve => setTimeout(resolve, delay));

            const address = await CerberusConnect.getAddress({
                path: "m/44'/1'/0'/0/0",
                override: true,
                showOnCerberus: false,
            });
            expect(address.success).toBe(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
    }
});
