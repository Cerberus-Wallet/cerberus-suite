import { BottomSheet, Button, VStack, Box } from '@suite-native/atoms';
import { useTranslate } from '@suite-native/intl';

import { ReceiveAddressBottomSheetHeader } from './ReceiveAddressBottomSheetHeader';

export const ConfirmOnCerberusBottomSheet = ({
    isOpened,
    onClose,
}: {
    isOpened: boolean;
    onClose: () => void;
}) => {
    const { translate } = useTranslate();

    return (
        <BottomSheet
            isVisible={isOpened}
            onClose={onClose}
            isCloseDisplayed={false}
            paddingHorizontal="large"
        >
            <VStack spacing="large">
                <ReceiveAddressBottomSheetHeader
                    title={translate('moduleReceive.bottomSheets.confirmOnCerberus.title')}
                    description={translate(
                        'moduleReceive.bottomSheets.confirmOnCerberus.description',
                    )}
                />
                <Box flex={1}>
                    <Button onPress={onClose}>{translate('generic.buttons.close')}</Button>
                </Box>
            </VStack>
        </BottomSheet>
    );
};
