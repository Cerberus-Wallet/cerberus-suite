import styled from 'styled-components';

import { typography } from '@cerberus/theme';

const H1 = styled.h1`
    ${typography.titleLarge};
`;

const H2 = styled.h2`
    ${typography.titleMedium};
`;

const H3 = styled.h3`
    ${typography.titleSmall};
`;

export { H1, H2, H3 };
