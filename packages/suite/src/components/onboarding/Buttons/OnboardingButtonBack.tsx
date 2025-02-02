import { Button, ButtonProps } from '@cerberus/components';
import { Translation } from 'src/components/suite';

export const OnboardingButtonBack = (props: Omit<ButtonProps, 'children'>) => (
    <Button
        data-test="@onboarding/back-button"
        variant="tertiary"
        size="small"
        icon="ARROW_LEFT"
        {...props}
    >
        <Translation id="TR_BACK" />
    </Button>
);
