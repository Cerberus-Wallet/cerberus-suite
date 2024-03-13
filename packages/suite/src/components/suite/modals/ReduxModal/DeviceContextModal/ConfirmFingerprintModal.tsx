import styled from 'styled-components';
import { ConfirmOnDevice } from '@cerberus/components';
import { Translation, Modal, ModalProps } from 'src/components/suite';
import { CerberusDevice } from 'src/types/suite';
import { Fingerprint } from 'src/components/firmware';

const StyledModal = styled(Modal)`
    width: 360px;
`;

interface ConfirmFingerprintProps extends ModalProps {
    device: CerberusDevice;
}

export const ConfirmFingerprintModal = ({ device, ...rest }: ConfirmFingerprintProps) => (
    <StyledModal
        modalPrompt={
            <ConfirmOnDevice
                title={<Translation id="TR_CONFIRM_ON_CERBERUS" />}
                deviceModelInternal={device.features?.internal_model}
                deviceUnitColor={device?.features?.unit_color}
            />
        }
        heading={<Translation id="TR_CHECK_FINGERPRINT" />}
        data-test="@suite/modal/confirm-fingerprint-on-device"
        {...rest}
    >
        <Fingerprint device={device} />
    </StyledModal>
);
