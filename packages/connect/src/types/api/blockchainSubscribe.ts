import type { SubscriptionAccountInfo, BlockchainLinkResponse } from '@cerberus/blockchain-link';
import type { CommonParamsWithCoin, Response } from '../params';

export type BlockchainSubscribe = CommonParamsWithCoin & {
    accounts?: SubscriptionAccountInfo[];
};

export declare function blockchainSubscribe(
    params: BlockchainSubscribe,
): Response<BlockchainLinkResponse<'subscribe'>>;
