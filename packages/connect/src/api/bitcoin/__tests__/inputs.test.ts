import { networks } from '@cerberus/utxo-lib';
import { validateCerberusInputs } from '../inputs';
import * as fixtures from '../__fixtures__/inputs';

describe('core/methods/tx/inputs', () => {
    describe('validateCerberusInputs', () => {
        const coinInfo: any = { network: networks.bitcoin };
        fixtures.validateCerberusInputs.forEach(f => {
            it(f.description, () => {
                if (f.result) {
                    expect(validateCerberusInputs(f.params as any, coinInfo)).toMatchObject(f.result);
                } else {
                    expect(() => validateCerberusInputs(f.params as any, coinInfo)).toThrow();
                }
            });
        });
    });
});
