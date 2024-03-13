import { useColorScheme } from 'react-native';

import { ThemeColorVariant } from '@cerberus/theme';

export const useSystemColorScheme = (): ThemeColorVariant => {
    const colorScheme = useColorScheme();
    if (colorScheme === 'dark') {
        return 'dark';
    }

    return 'standard';
};
