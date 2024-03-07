import { selectDeviceButtonRequests } from '@suite-common/wallet-core';
import { useSelector } from 'src/hooks/suite';

export const usePin = () => {
    const buttonRequests = useSelector(selectDeviceButtonRequests);

    const pinRequestType = buttonRequests[buttonRequests.length - 1];
    const invalidCounter = buttonRequests.filter(r => r.code === 'ui-invalid_pin').length || 0;

    const isExtended =
        (pinRequestType?.code &&
            ['PinMatrixRequestType_NewFirst', 'PinMatrixRequestType_NewSecond'].includes(
                pinRequestType.code,
            )) ||
        invalidCounter > 0;

    const isWipeCode =
        pinRequestType?.code &&
        ['PinMatrixRequestType_WipeCodeFirst', 'PinMatrixRequestType_WipeCodeSecond'].includes(
            pinRequestType?.code,
        );

    return {
        isExtended,
        isWipeCode,
        invalidCounter,
    };
};
