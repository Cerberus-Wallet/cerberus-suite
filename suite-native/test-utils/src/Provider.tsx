import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createRenderer, StylesProvider } from '@cerberus/styles';
import { prepareNativeTheme } from '@cerberus/theme';

type ProviderProps = {
    children: ReactNode;
};
const renderer = createRenderer();
const theme = prepareNativeTheme({ colorVariant: 'standard' });

export const Provider = ({ children }: ProviderProps) => (
    <SafeAreaProvider>
        <StylesProvider theme={theme} renderer={renderer}>
            {children}
        </StylesProvider>
    </SafeAreaProvider>
);
