import { test as testPlaywright, ElectronApplication, Page } from '@playwright/test';

import { CerberusUserEnvLink } from '@cerberus/cerberus-user-env-link';

import { launchSuite, rmDirRecursive } from '../../support/common';
import { onTopBar } from '../../support/pageActions/topBarActions';
import { onSettingsPage } from '../../support/pageActions/settingsActions';
import { onDashboardPage } from '../../support/pageActions/dashboardActions';

let electronApp: ElectronApplication;
let window: Page;
let localDataDir: string;

testPlaywright.describe.serial('Suite works with Electrum server', () => {
    testPlaywright.beforeAll(async () => {
        await CerberusUserEnvLink.api.stopBridge();
        await CerberusUserEnvLink.api.cerberusUserEnvConnect();
        await CerberusUserEnvLink.api.startEmu({ wipe: true });
        await CerberusUserEnvLink.api.setupEmu({
            needs_backup: true,
            mnemonic: 'all all all all all all all all all all all all',
        });
        ({ electronApp, window, localDataDir } = await launchSuite());
        rmDirRecursive(localDataDir);
    });

    testPlaywright.afterAll(() => {
        electronApp.close();
    });

    testPlaywright('Electrum completes discovery successfully', async () => {
        const electrumUrl = '127.0.0.1:50001:t';

        await onDashboardPage.passThroughInitialRun(window);
        await onDashboardPage.discoveryShouldFinish(window);

        await onTopBar.openSettings(window);
        await onSettingsPage.toggleDebugModeInSettings(window);
        await onSettingsPage.goToDesiredSettingsPlace(window, 'wallet');
        await onSettingsPage.openNetworkSettings(window, 'regtest');
        await onSettingsPage.changeNetworkBackend(window, 'electrum', electrumUrl);

        await onTopBar.openDashboard(window);
        await onDashboardPage.discoveryShouldFinish(window);

        await onDashboardPage.assertHasVisibleBalanceOnFirstAccount(window, 'regtest');

        electronApp.close();
    });
});
