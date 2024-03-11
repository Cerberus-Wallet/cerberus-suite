import { selectDeviceButtonRequests } from '@suite-common/wallet-core';
import { useSelector } from 'src/hooks/suite';

export const usePin = () => {
    const buttonRequests = useSelector(selectDeviceButtonRequests);

    const pinRequestType = buttonRequests[buttonRequests.length - 1];
    const invalidCounter = buttonRequests.filter(r => r.code === 'ui-invalid_pin').length || 0;
    const newPinRequestTypes = ['PinMatrixRequestType_NewFirst', 'PinMatrixRequestType_NewSecond'];
    const newWipeCodeRequestTypes = [
        'PinMatrixRequestType_WipeCodeFirst',
        'PinMatrixRequestType_WipeCodeSecond',
    ];

    // 3 cases when we want to show left column
    // 1) and 2) - Setting a new pin: 1 entry, 2nd (confirmation) entry
    // 3) Invalid pin (It doesn't seem to work anymore) instead separate PinMismatchModal is shown
    const isRequestingNewPinCode =
        (pinRequestType?.code && newPinRequestTypes.includes(pinRequestType.code)) ||
        invalidCounter > 0;

    const isWipeCode =
        pinRequestType?.code && newWipeCodeRequestTypes.includes(pinRequestType?.code);

    return {
        isRequestingNewPinCode,
        isWipeCode,
        invalidCounter,
    };
};
