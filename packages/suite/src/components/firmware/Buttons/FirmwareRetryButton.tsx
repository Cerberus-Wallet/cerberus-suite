import React from 'react';

import { Button, ButtonProps } from '@cerberus/components';
import { Translation } from 'src/components/suite';

export const FirmwareRetryButton = (props: Omit<ButtonProps, 'children'>) => (
    <Button {...props} data-test="@firmware/retry-button">
        <Translation id="TR_RETRY" />
    </Button>
);
