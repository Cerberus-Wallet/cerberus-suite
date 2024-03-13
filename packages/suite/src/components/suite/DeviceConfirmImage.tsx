import { CerberusDevice } from 'src/types/suite';
import { Image, ImageProps } from '@cerberus/components';

interface DeviceConfirmImageProps extends Omit<ImageProps, 'image'> {
    device: CerberusDevice;
}

export const DeviceConfirmImage = ({ device, ...rest }: DeviceConfirmImageProps) => {
    const deviceModelInternal = device.features?.internal_model;

    if (!deviceModelInternal) {
        return null;
    }

    const imgName = `DEVICE_CONFIRM_CERBERUS_${deviceModelInternal}` as const;

    return <Image {...rest} image={imgName} />;
};
