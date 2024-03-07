import styled from 'styled-components';
import TrezorConnect from '@trezor/connect';

import { PinMatrix, Modal, Translation, ModalProps } from 'src/components/suite';
import { PIN_MATRIX_MAX_WIDTH } from 'src/components/suite/PinMatrix/PinMatrix';
import { TrezorDevice } from 'src/types/suite';
import { usePin } from 'src/hooks/suite/usePinModal';

const StyledModal = styled(Modal)<{ $isExtended: boolean }>`
    width: unset;

    ${Modal.Description} {
        max-width: ${({ $isExtended }) =>
            $isExtended
                ? 'fit-content'
                : PIN_MATRIX_MAX_WIDTH}; /* limit width to prevent extending the modal past the width of the pin matrix */
    }
`;

interface PinModalProps extends ModalProps {
    device: TrezorDevice;
}

export const PinModal = ({ device, ...rest }: PinModalProps) => {
    const { isExtended, isWipeCode, invalidCounter } = usePin();

    if (!device.features) return null;

    const onCancel = () => TrezorConnect.cancel('pin-cancelled');

    // 3 cases when we want to show left column
    // 1) and 2) - Setting a new pin: 1 entry, 2nd (confirmation) entry
    // 3) Invalid pin (It doesn't seem to work anymore) instead separate PinMismatchModal is shown

    return (
        <StyledModal
            heading={<Translation id={isWipeCode ? 'TR_ENTER_WIPECODE' : 'TR_ENTER_PIN'} />}
            description={
                <Translation
                    id="TR_THE_PIN_LAYOUT_IS_DISPLAYED"
                    values={{ deviceLabel: device.label, b: text => <b>{text}</b> }}
                />
            }
            onCancel={onCancel}
            isCancelable
            data-test="@modal/pin"
            $isExtended={isExtended}
            {...rest}
        >
            <PinMatrix device={device} hideExplanation={!isExtended} invalid={invalidCounter > 0} />
        </StyledModal>
    );
};
