import type { BlockchainLinkResponse } from '@cerberus/blockchain-link';
import type { Response } from '../params';
import type { BlockchainSubscribeFiatRates } from './blockchainSubscribeFiatRates';

export declare function blockchainUnsubscribeFiatRates(
    params: BlockchainSubscribeFiatRates,
): Response<BlockchainLinkResponse<'unsubscribe'>>;
