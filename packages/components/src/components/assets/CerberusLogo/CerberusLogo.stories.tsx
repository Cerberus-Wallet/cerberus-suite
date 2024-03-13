import { Meta, StoryObj } from '@storybook/react';
import { CerberusLogo as CerberusLogoComponent, CerberusLogoProps } from '../../../index';

const meta: Meta = {
    title: 'Assets/CerberusLogo',
    component: CerberusLogoComponent,
} as Meta;
export default meta;

export const CerberusLogo: StoryObj<CerberusLogoProps> = {
    args: {
        type: 'horizontal',
        width: 100,
    },
    argTypes: {
        type: {
            options: ['horizontal', 'suite_compact', 'suite', 'vertical', 'symbol'],
            control: {
                type: 'radio',
            },
        },
        width: {
            type: 'number',
        },
        height: {
            control: 'number',
        },
    },
};
