import { useNavigation } from '@react-navigation/native';

import {
    AccountsImportStackRoutes,
    ConnectDeviceStackRoutes,
    HomeStackParamList,
    HomeStackRoutes,
    RootStackParamList,
    RootStackRoutes,
    StackToStackCompositeNavigationProps,
} from '@suite-native/navigation';
import { VStack, Card, Button, Text, Box } from '@suite-native/atoms';
import { useNativeStyles, prepareNativeStyle } from '@cerberus/styles';
import { Translation, useTranslate } from '@suite-native/intl';
import { analytics, EventType } from '@suite-native/analytics';
import { useActiveColorScheme } from '@suite-native/theme';

import { ConnectCerberusSvg } from '../../../assets/ConnectCerberusSvg';
import { DarkConnectedCerberusSvg } from '../../../assets/DarkConnectedCerberusSvg';

const cardStyle = prepareNativeStyle<{ flex: 1 | 2 }>((utils, { flex }) => ({
    flex,
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: utils.spacings.extraLarge,
}));

type NavigationProps = StackToStackCompositeNavigationProps<
    HomeStackParamList,
    HomeStackRoutes.Home,
    RootStackParamList
>;

export const EmptyPortfolioCrossroads = () => {
    const { applyStyle } = useNativeStyles();
    const navigation = useNavigation<NavigationProps>();

    const { translate } = useTranslate();

    const colorScheme = useActiveColorScheme();

    const handleSyncMyCoins = () => {
        navigation.navigate(RootStackRoutes.AccountsImport, {
            screen: AccountsImportStackRoutes.SelectNetwork,
        });
        analytics.report({ type: EventType.EmptyDashboardClick, payload: { action: 'syncCoins' } });
    };

    const handleConnectDevice = () => {
        navigation.navigate(RootStackRoutes.ConnectDevice, {
            screen: ConnectDeviceStackRoutes.ConnectAndUnlockDevice,
        });
        analytics.report({
            type: EventType.EmptyDashboardClick,
            payload: { action: 'connectDevice' },
        });
    };

    return (
        <VStack spacing="medium" flex={1}>
            <Card style={applyStyle(cardStyle, { flex: 2 })}>
                <VStack spacing="large" justifyContent="center" alignItems="center">
                    <VStack alignItems="center" spacing="large">
                        {colorScheme === 'dark' ? <DarkConnectedCerberusSvg /> : <ConnectCerberusSvg />}
                        <VStack alignItems="center">
                            <Box>
                                <Text variant="titleSmall" textAlign="center">
                                    <Translation id="moduleHome.emptyState.connectOrImportCrossroads.gotMyCerberus.title" />
                                </Text>
                            </Box>
                            <Text color="textSubdued" textAlign="center">
                                <Translation id="moduleHome.emptyState.connectOrImportCrossroads.gotMyCerberus.description" />
                            </Text>
                        </VStack>
                    </VStack>
                    <Button onPress={handleConnectDevice} size="large">
                        {translate(
                            'moduleHome.emptyState.connectOrImportCrossroads.gotMyCerberus.connectButton',
                        )}
                    </Button>
                </VStack>
            </Card>
            <Card style={applyStyle(cardStyle, { flex: 1 })}>
                <VStack spacing="large" justifyContent="center" alignItems="center">
                    <VStack spacing="small" alignItems="center">
                        <Text variant="titleSmall" textAlign="center">
                            <Translation id="moduleHome.emptyState.connectOrImportCrossroads.syncCoins.title" />
                        </Text>
                        <Text color="textSubdued" textAlign="center">
                            <Translation id="moduleHome.emptyState.connectOrImportCrossroads.syncCoins.description" />
                        </Text>
                    </VStack>
                    <Button
                        onPress={handleSyncMyCoins}
                        colorScheme="tertiaryElevation1"
                        size="large"
                    >
                        {translate(
                            'moduleHome.emptyState.connectOrImportCrossroads.syncCoins.syncButton',
                        )}
                    </Button>
                </VStack>
            </Card>
        </VStack>
    );
};
