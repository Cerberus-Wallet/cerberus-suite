import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import { useNativeStyles } from '@cerberus/styles';
import { Color } from '@cerberus/theme';

import { Box } from './Box';
import { Text } from './Text';

type LoaderProps = {
    size?: ActivityIndicatorProps['size'];
    title?: string;
    color?: Color;
};

// TODO: modify component to fit Figma design.
// issue: https://github.com/Cerberus-Wallet/cerberus-suite/issues/7538
export const Loader = ({ size, title, color = 'backgroundPrimaryDefault' }: LoaderProps) => {
    const {
        utils: { colors },
    } = useNativeStyles();

    return (
        <Box>
            <ActivityIndicator size={size} color={colors[color]} />
            {title && (
                <Text variant="label" color="textSubdued" textAlign="center">
                    {title}
                </Text>
            )}
        </Box>
    );
};
