import { useNavigation } from '@react-navigation/core';

import {
    RootStackParamList,
    SettingsStackParamList,
    SettingsStackRoutes,
    StackToStackCompositeNavigationProps,
} from '@suite-native/navigation';
import { CerberusSuiteLiteHeader } from '@suite-native/atoms';

import { SettingsSection } from './SettingsSection';
import { SettingsSectionItem } from './SettingsSectionItem';

export const SupportSettings = () => {
    const navigation =
        useNavigation<
            StackToStackCompositeNavigationProps<
                SettingsStackParamList,
                SettingsStackRoutes,
                RootStackParamList
            >
        >();

    return (
        <SettingsSection title="Support">
            <SettingsSectionItem
                iconName="questionLight"
                title="Get help"
                subtitle="FAQ, Customer support"
                onPress={() => navigation.navigate(SettingsStackRoutes.SettingsFAQ)}
            />
            <SettingsSectionItem
                title={
                    <>
                        About <CerberusSuiteLiteHeader textVariant="body" />
                    </>
                }
                iconName="cerberusT"
                onPress={() => navigation.navigate(SettingsStackRoutes.SettingsAbout)}
            />
        </SettingsSection>
    );
};
