import type { Transaction } from '@cerberus/blockchain-link';
import type { CommonParamsWithCoin, Response } from '../params';

export type BlockchainGetTransactions = CommonParamsWithCoin & {
    txs: string[];
};

export declare function blockchainGetTransactions(
    params: BlockchainGetTransactions,
): Response<Transaction[]>;
