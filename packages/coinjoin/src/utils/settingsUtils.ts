import { networks } from '@cerberus/utxo-lib';

import { CoinjoinBackendSettings } from '../types';

export const getNetwork = (network: CoinjoinBackendSettings['network']) => {
    switch (network) {
        case 'btc':
            return networks.bitcoin;
        case 'test':
            return networks.testnet;
        case 'regtest':
            return networks.regtest;
        default:
            throw new Error('Other coins than REGTEST are currently not supported');
    }
};
