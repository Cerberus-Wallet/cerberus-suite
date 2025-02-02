import styled from 'styled-components';
import { H3 } from '@cerberus/components';
import { Translation } from 'src/components/suite/Translation';

import { CoinjoinBalanceSection } from './CoinjoinBalanceSection';

const Container = styled.div`
    width: 100%;
    margin-bottom: 32px;
`;

const Heading = styled(H3)`
    margin-bottom: 28px;
`;

interface CoinjoinSummaryProps {
    accountKey: string;
}

export const CoinjoinSummary = ({ accountKey }: CoinjoinSummaryProps) => (
    <Container>
        <Heading>
            <Translation id="TR_MY_COINS" />
        </Heading>

        <CoinjoinBalanceSection accountKey={accountKey} />
    </Container>
);
