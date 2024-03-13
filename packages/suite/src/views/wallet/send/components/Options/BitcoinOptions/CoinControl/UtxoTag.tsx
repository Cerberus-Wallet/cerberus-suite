import { ReactNode } from 'react';
import { Icon, Tooltip, IconType } from '@cerberus/components';

interface UtxoTagProps {
    icon: IconType;
    iconColor: string;
    tooltipMessage: ReactNode;
}

export const UtxoTag = ({ icon, iconColor, tooltipMessage }: UtxoTagProps) => (
    <Tooltip interactive={false} content={tooltipMessage}>
        <Icon icon={icon} color={iconColor} size={16} />
    </Tooltip>
);
