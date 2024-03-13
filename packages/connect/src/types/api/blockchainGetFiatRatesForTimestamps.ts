import type { BlockchainLinkParams, BlockchainLinkResponse } from '@cerberus/blockchain-link';
import type { CommonParamsWithCoin, Response } from '../params';

export declare function blockchainGetFiatRatesForTimestamps(
    params: CommonParamsWithCoin & BlockchainLinkParams<'getFiatRatesForTimestamps'>,
): Response<BlockchainLinkResponse<'getFiatRatesForTimestamps'>>;
