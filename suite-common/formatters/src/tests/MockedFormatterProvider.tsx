import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { PROTO } from '@cerberus/connect';

import { FormatterProviderContext, getFormatters } from '../FormatterProvider';

type MockedFormatterProviderProps = {
    children: ReactNode;
};

export const MockedFormatterProvider = ({ children }: MockedFormatterProviderProps) => {
    const intl = useIntl();

    const formatters = getFormatters({
        locale: 'en',
        fiatCurrency: 'usd',
        bitcoinAmountUnit: PROTO.AmountUnit.BITCOIN,
        intl,
        is24HourFormat: true,
    });

    return (
        <FormatterProviderContext.Provider value={formatters}>
            {children}
        </FormatterProviderContext.Provider>
    );
};
