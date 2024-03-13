import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
import { CerberusLogo } from '../../../index';
import { StoryColumn } from '../../../support/Story';

interface WrapperProps {
    isDark?: boolean;
}

const LogoWrapper = styled.div<WrapperProps>`
    display: flex;
    min-height: 100px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const meta: Meta = {
    title: 'Assets/CerberusLogos',
} as Meta;
export default meta;

export const All: StoryObj = {
    render: () => (
        <StoryColumn minWidth={400}>
            <LogoWrapper>
                <CerberusLogo
                    type="horizontal"
                    width="200px"
                    data-test="cerberus-logo-horizontal-black"
                />
                <CerberusLogo type="vertical" width="120px" data-test="cerberus-logo-vertical-black" />
                <CerberusLogo type="symbol" width="50px" data-test="cerberus-logo-symbol-black" />
                <CerberusLogo type="suite" width="200px" data-test="cerberus-suite-logo-black" />
                <CerberusLogo
                    type="suite_square"
                    width="50px"
                    data-test="cerberus-suite-square-logo-white"
                />
                <CerberusLogo
                    type="suite_compact"
                    width="200px"
                    data-test="cerberus-suite-compact-logo-white"
                />
            </LogoWrapper>
        </StoryColumn>
    ),
};
