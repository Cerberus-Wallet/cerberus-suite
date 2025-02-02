// TODO: remove whole file, replaced by @suite-components/PrerequisitesGuide/components/DeviceAcquire

import { acquireDevice } from '@suite-common/wallet-core';
import { Button } from '@cerberus/components';

import { useDevice, useDispatch } from 'src/hooks/suite';
import { Translation, DeviceInvalidModeLayout } from 'src/components/suite';

export const DeviceAcquire = () => {
    const dispatch = useDispatch();
    const { device, isLocked } = useDevice();

    if (!device) return null;

    const handleClick = () => dispatch(acquireDevice());

    return (
        <DeviceInvalidModeLayout
            title={<Translation id="TR_ACQUIRE_DEVICE_TITLE" />}
            text={<Translation id="TR_ACQUIRE_DEVICE_DESCRIPTION" />}
            image="DEVICE_ANOTHER_SESSION"
            resolveButton={
                <Button isLoading={isLocked()} onClick={handleClick}>
                    <Translation id="TR_ACQUIRE_DEVICE" />
                </Button>
            }
        />
    );
};
