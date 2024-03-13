import { TypographyStyle } from '@cerberus/theme';
import { Translation } from '@suite-native/intl';

import { Text } from './Text';

type CerberusSuiteLiteHeaderProps = {
    textVariant?: TypographyStyle;
};

export const CerberusSuiteLiteHeader = ({
    textVariant = 'titleSmall',
}: CerberusSuiteLiteHeaderProps) => (
    <Text variant={textVariant} color="textSecondaryHighlight" textAlign="center">
        <Translation
            id="generic.header"
            values={{
                green: chunks => (
                    <Text variant={textVariant} color="textSecondaryHighlight">
                        {chunks}
                    </Text>
                ),
                grey: chunks => (
                    <Text variant={textVariant} color="textSubdued">
                        {chunks}
                    </Text>
                ),
            }}
        />
    </Text>
);
