import CerberusConnect from '../../../src';

const { getController, setup, initCerberusConnect } = global.Cerberus;

const controller = getController();

describe('CerberusConnect.checkFirmwareAuthenticity', () => {
    beforeAll(async () => {
        await setup(controller, {
            mnemonic: 'mnemonic_all',
        });
        await initCerberusConnect(controller);
    });

    afterAll(async () => {
        controller.dispose();
        await CerberusConnect.dispose();
    });

    it('sometimes valid sometimes not, depends on circumstances', async () => {
        const result = await CerberusConnect.checkFirmwareAuthenticity({});

        if (result.success) {
            // when running with emulator, hashes will never match.
            expect(typeof result.payload.valid).toEqual('boolean');
            expect(typeof result.payload.expectedFirmwareHash).toEqual('string');
            expect(typeof result.payload.actualFirmwareHash).toEqual('string');
        }
    });
});
