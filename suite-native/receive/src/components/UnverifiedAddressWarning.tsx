import { Box, Text, Pictogram, CerberusSuiteLiteHeader } from '@suite-native/atoms';
import { useTranslate, Translation } from '@suite-native/intl';

export const UnverifiedAddressWarning = () => {
    const { translate } = useTranslate();

    return (
        <Box marginVertical="medium" paddingHorizontal="medium" paddingVertical="extraLarge">
            <Pictogram
                variant="yellow"
                icon="warningTriangleLight"
                title={
                    <Text>
                        <CerberusSuiteLiteHeader />
                        {'\n'}
                        <Text variant="titleSmall">
                            <Translation id="moduleReceive.receiveAddressCard.unverifiedWarning.title" />
                        </Text>
                    </Text>
                }
                subtitle={translate('moduleReceive.receiveAddressCard.unverifiedWarning.content')}
            />
        </Box>
    );
};
