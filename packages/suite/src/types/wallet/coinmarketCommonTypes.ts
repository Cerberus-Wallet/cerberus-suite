import type { ReactElement } from 'react';
import type { Account } from 'src/types/wallet';
import type {
    BuyTrade,
    SellFiatTrade,
    ExchangeTrade,
    PaymentFrequency,
    SellVoucherTrade as SpendTrade,
    SavingsTradeItem,
} from 'invity-api';
import type { FlagProps } from '@cerberus/components';

type CommonTrade = {
    date: string;
    key?: string;
    account: {
        descriptor: Account['descriptor'];
        symbol: Account['symbol'];
        accountType: Account['accountType'];
        accountIndex: Account['index'];
    };
};
export type TradeType = 'buy' | 'sell' | 'exchange' | 'spend' | 'savings';
export type TradeBuy = CommonTrade & { tradeType: 'buy'; data: BuyTrade };
export type TradeSell = CommonTrade & { tradeType: 'sell'; data: SellFiatTrade };
export type TradeExchange = CommonTrade & { tradeType: 'exchange'; data: ExchangeTrade };
export type TradeSpend = CommonTrade & { tradeType: 'spend'; data: SpendTrade };
export type TradeSavings = CommonTrade & { tradeType: 'savings'; data: SavingsTradeItem };
export type Trade = TradeBuy | TradeSell | TradeExchange | TradeSpend | TradeSavings;

export type Option = { value: string; label: string };
export type CountryOption = { value: FlagProps['country']; label: string };
export type DefaultCountryOption = { value: string; label: string };
export type TranslationOption = { value: string; label?: ReactElement };

export type PaymentFrequencyOption = Option & { label: JSX.Element };

export type Savings = {
    paymentFrequency: PaymentFrequency;
    fiatAmount: string;
    customFiatAmount: string;
};

export interface CryptoAmountLimits {
    currency: string;
    minCrypto?: number;
    maxCrypto?: number;
}

export interface AmountLimits extends CryptoAmountLimits {
    minFiat?: number;
    maxFiat?: number;
}
