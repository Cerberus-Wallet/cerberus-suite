import type { BlockchainLinkResponse } from '@cerberus/blockchain-link';
import type { Response } from '../params';
import type { BlockchainSubscribe } from './blockchainSubscribe';

export declare function blockchainUnsubscribe(
    params: BlockchainSubscribe,
): Response<BlockchainLinkResponse<'unsubscribe'>>;
