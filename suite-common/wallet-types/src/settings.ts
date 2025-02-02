import { Network } from '@suite-common/wallet-config';
import { FeeLevel, PROTO } from '@cerberus/connect';
import { FiatCurrencyCode } from '@suite-common/suite-config';

export interface WalletSettings {
    localCurrency: FiatCurrencyCode;
    discreetMode: boolean;
    enabledNetworks: Network['symbol'][];
    bitcoinAmountUnit: PROTO.AmountUnit;
    lastUsedFeeLevel: {
        [key: string]: Omit<FeeLevel, 'blocks'>; // Key: Network['symbol']
    };
}
