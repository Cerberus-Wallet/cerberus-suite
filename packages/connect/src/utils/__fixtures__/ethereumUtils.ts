import coinsJSON from '@cerberus/connect-common/files/coins.json';
import coinsJSONEth from '@cerberus/connect-common/files/coins-eth.json';

import { getNetworkLabel } from '../ethereumUtils';

import { parseCoinsJson, getEthereumNetwork } from '../../data/coinInfo';

parseCoinsJson({
    ...coinsJSON,
    eth: coinsJSONEth,
});

export const getNetworkLabelFixtures: TestFixtures<typeof getNetworkLabel> = [
    {
        description: 'eth',
        input: ['Export #NETWORK address', getEthereumNetwork('eth')],
        output: 'Export Ethereum address',
    },
];
