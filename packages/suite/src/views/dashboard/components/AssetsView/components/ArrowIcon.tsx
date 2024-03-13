import { Icon } from '@cerberus/components';
import { spacingsPx } from '@cerberus/theme';
import styled, { css } from 'styled-components';

export const ArrowIcon = styled(Icon)`
    transition: opacity 0.1s;
    margin: ${spacingsPx.xs};
`;

export const styledHoverOnParentOfArrowIcon = css`
    :hover {
        ${ArrowIcon} {
            path {
                fill: ${({ theme }) => theme.iconPrimaryDefault};
            }
        }
    }
`;
