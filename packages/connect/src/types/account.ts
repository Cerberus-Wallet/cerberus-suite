import type {
    AccountInfo as AccountInfoBase,
    AccountAddresses,
    Utxo as AccountUtxo,
} from '@cerberus/blockchain-link';

export type {
    AccountAddresses,
    Utxo as AccountUtxo,
    Address as AccountAddress,
    Transaction as AccountTransaction,
} from '@cerberus/blockchain-link';

export type DiscoveryAccountType = 'p2pkh' | 'p2sh' | 'p2tr' | 'p2wpkh';

export interface AccountInfo extends AccountInfoBase {
    path?: string;
    legacyXpub?: string; // bitcoin-like descriptor in legacy format (xpub) used by labeling (metadata)
    utxo?: AccountUtxo[]; // bitcoin utxo
    descriptorChecksum?: string;
}
export interface DiscoveryAccount {
    type: DiscoveryAccountType;
    label: string;
    descriptor: string;
    address_n: number[];
    empty?: boolean;
    balance?: string;
    addresses?: AccountAddresses;
    descriptorChecksum?: string;
}
