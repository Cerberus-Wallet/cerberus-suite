import React from 'react';
import styled from 'styled-components';
import { Button, ButtonProps } from '@cerberus/components';
import { Translation } from 'src/components/suite';

const StyledButton = styled(Button)`
    min-width: 180px;
`;

export const FirmwareContinueButton = (props: Omit<ButtonProps, 'children'>) => (
    <StyledButton {...props} data-test="@firmware/continue-button">
        <Translation id="TR_CONTINUE" />
    </StyledButton>
);
