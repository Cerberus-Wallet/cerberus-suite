import CerberusConnect, { Success, PROTO, Unsuccessful } from '../../../src';

const { ADDRESS_N } = global.TestUtils;
const { getController, setup, conditionalTest, initCerberusConnect } = global.Cerberus;

describe('CerberusConnect.cancelCoinjoinAuthorization', () => {
    const controller = getController();

    beforeAll(async () => {
        await setup(controller, {
            mnemonic: 'mnemonic_all',
        });
    });

    beforeEach(async () => {
        // restart connect for each test (working with event listeners)
        await CerberusConnect.dispose();
        await initCerberusConnect(controller, { debug: false });
    });

    afterAll(async () => {
        controller.dispose();
        await CerberusConnect.dispose();
    });

    conditionalTest(['1', '<2.5.4'], 'Cancel authorization works', async () => {
        const auth = await CerberusConnect.authorizeCoinjoin({
            coordinator: 'www.example.com',
            maxRounds: 2,
            maxCoordinatorFeeRate: 500000, // 5% => 0.005 * 10**8;
            maxFeePerKvbyte: 3500,
            path: ADDRESS_N("m/10025'/1'/0'/1'"),
            coin: 'Testnet',
            scriptType: 'SPENDTAPROOT',
        });

        expect(auth.success).toBe(true);
        expect(auth.payload).toEqual({ message: 'Coinjoin authorized' });

        const commitmentData =
            '0f7777772e6578616d706c652e636f6d0000000000000000000000000000000000000000000000000000000000000001';

        const proof = await CerberusConnect.getOwnershipProof({
            coin: 'Testnet',
            path: ADDRESS_N("m/10025'/1'/0'/1'/1/0"),
            scriptType: 'SPENDTAPROOT',
            userConfirmation: true,
            commitmentData,
            preauthorized: true,
        });

        expect(proof.success).toBe(true);

        const cancelAuthResult = await CerberusConnect.cancelCoinjoinAuthorization({});
        expect(cancelAuthResult.success).toBe(true);
        expect((cancelAuthResult as Success<PROTO.Success>).payload.message).toBe(
            'Authorization cancelled',
        );

        const proof2 = await CerberusConnect.getOwnershipProof({
            coin: 'Testnet',
            path: ADDRESS_N("m/10025'/1'/0'/1'/1/0"),
            scriptType: 'SPENDTAPROOT',
            userConfirmation: true,
            commitmentData,
            preauthorized: true,
        });

        expect(proof2.success).toBe(false);
        expect((proof2 as Unsuccessful).payload.error).toBe('No preauthorized operation');
    });
});
