import styled from 'styled-components';

import * as deviceUtils from '@suite-common/suite-utils';
import { IconButton } from '@cerberus/components';

import { NotificationCard, Translation } from 'src/components/suite';
import { CerberusDevice } from 'src/types/suite';

const GrayNotificationCard = styled(NotificationCard)`
    background: ${({ theme }) => theme.BG_GREY};
    margin-bottom: 0;
`;
interface DeviceHeaderButtonProps {
    needsAttention: boolean;
    device: CerberusDevice;
    onSolveIssueClick: () => void;
    onDeviceSettingsClick: () => void;
}

export const DeviceHeaderButton = ({
    device,
    needsAttention,
    onDeviceSettingsClick,
    onSolveIssueClick,
}: DeviceHeaderButtonProps) => {
    const deviceStatus = deviceUtils.getStatus(device);
    const deviceStatusMessage = deviceUtils.getDeviceNeedsAttentionMessage(deviceStatus);
    const isUnknown = device.type !== 'acquired';

    return (
        <>
            {needsAttention && (
                <GrayNotificationCard
                    variant="warning"
                    button={{
                        children: <Translation id="TR_SOLVE_ISSUE" />,
                        onClick: onSolveIssueClick,
                        'data-test': `@switch-device/${device.path}/solve-issue-button`,
                    }}
                >
                    {deviceStatusMessage && <Translation id={deviceStatusMessage} />}
                </GrayNotificationCard>
            )}
            {!needsAttention && !isUnknown && (
                <IconButton
                    variant="tertiary"
                    icon="SETTINGS"
                    onClick={onDeviceSettingsClick}
                    size="small"
                />
            )}
        </>
    );
};
