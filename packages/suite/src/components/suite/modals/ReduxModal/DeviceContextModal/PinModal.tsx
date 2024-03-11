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
    const { isRequestingNewPinCode, isWipeCode, invalidCounter } = usePin();

    if (!device.features) return null;

    const onCancel = () => TrezorConnect.cancel('pin-cancelled');

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
            $isExtended={isRequestingNewPinCode}
            {...rest}
        >
            <PinMatrix
                device={device}
                hideExplanation={!isRequestingNewPinCode}
                invalid={invalidCounter > 0}
            />
        </StyledModal>
    );
};
