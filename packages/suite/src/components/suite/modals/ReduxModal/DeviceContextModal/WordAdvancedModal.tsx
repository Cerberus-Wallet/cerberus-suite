import styled from 'styled-components';
import CerberusConnect from '@cerberus/connect';
import { Paragraph } from '@cerberus/components';
import { HELP_CENTER_ADVANCED_RECOVERY_URL } from '@cerberus/urls';
import {
    Translation,
    WordInputAdvanced,
    CerberusLink,
    Modal,
    ModalProps,
} from 'src/components/suite';
import { useIntl } from 'react-intl';
import messages from 'src/support/messages';

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const BottomText = styled.div`
    margin-top: 20px;
`;

interface WordAdvancedModalProps extends ModalProps {
    count: 6 | 9;
}

export const WordAdvancedModal = ({ count, ...rest }: WordAdvancedModalProps) => {
    const intl = useIntl();

    return (
        <Modal
            heading={<Translation id="TR_FOLLOW_INSTRUCTIONS_ON_DEVICE" />}
            description={<Translation id="TR_ADVANCED_RECOVERY_TEXT" />}
            onCancel={() => CerberusConnect.cancel(intl.formatMessage(messages.TR_CANCELLED))}
            isCancelable
            totalProgressBarSteps={5}
            currentProgressBarStep={4}
            {...rest}
        >
            <ContentWrapper>
                <WordInputAdvanced count={count} />
                <BottomText>
                    <Paragraph type="label">
                        <Translation id="TR_ADVANCED_RECOVERY_NOT_SURE" />{' '}
                        <CerberusLink type="label" href={HELP_CENTER_ADVANCED_RECOVERY_URL}>
                            <Translation id="TR_LEARN_MORE" />
                        </CerberusLink>
                    </Paragraph>
                </BottomText>
            </ContentWrapper>
        </Modal>
    );
};
