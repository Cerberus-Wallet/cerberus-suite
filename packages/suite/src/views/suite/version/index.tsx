import styled from 'styled-components';
import { Link, H2, Paragraph } from '@cerberus/components';
import { Modal } from 'src/components/suite';
import { getCommitHash, getSuiteVersion } from '@cerberus/env-utils';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Line = styled.div`
    padding: 20px;
`;

export const Version = () => (
    <Modal data-test="@modal/version">
        <Wrapper>
            <Paragraph type="callout">APPLICATION VERSION</Paragraph>
            <H2 data-test="@version/number">{getSuiteVersion()}</H2>
            <Line />
            <Paragraph type="callout">LAST COMMIT HASH</Paragraph>
            <Link
                href={`https://github.com/Cerberus-Wallet/cerberus-suite/commits/${getCommitHash()}`}
                data-test="@version/commit-hash-link"
            >
                <H2>{getCommitHash()}</H2>
            </Link>
        </Wrapper>
    </Modal>
);
