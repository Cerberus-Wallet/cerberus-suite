/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
// @ts-ignore
import commonFixtures from '../../../../submodules/cerberus-common/tests/fixtures/ethereum/getpublickey.json';

export default {
    method: 'ethereumGetPublicKey',
    setup: {
        mnemonic: commonFixtures.setup.mnemonic,
    },
    tests: commonFixtures.tests.flatMap(({ parameters, result }) => ({
        description: parameters.path,
        params: {
            path: parameters.path,
        },
        result: {
            fingerprint: result.fingerprint,
            childNum: result.child_num,
            chainCode: result.chain_code,
            publicKey: result.public_key,
            xpub: result.xpub,
        },
    })),
};
