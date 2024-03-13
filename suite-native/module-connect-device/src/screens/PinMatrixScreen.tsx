import { Image, VStack } from '@suite-native/atoms';

import { ConnectDeviceSreenView } from '../components/ConnectDeviceSreenView';
import { PinForm } from '../components/PinForm';

export const PinMatrixScreen = () => (
    <ConnectDeviceSreenView>
        <VStack spacing="medium" alignItems="center" flex={1} marginTop="large">
            <Image source={require('../assets/cerberusPin.png')} width={161} height={194} />
            <PinForm />
        </VStack>
    </ConnectDeviceSreenView>
);
