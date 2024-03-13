import styled from 'styled-components';

import { Button, ButtonProps } from '@cerberus/components';

const StyledButton = styled(Button)`
    min-height: 53px;
`;

export const SecurityCheckButton = (props: ButtonProps) => <StyledButton {...props} />;
