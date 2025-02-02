import { test as testPlaywright, expect as expectPlaywright } from '@playwright/test';

import { CerberusUserEnvLink } from '@cerberus/cerberus-user-env-link';

import { launchSuite, waitForDataTestSelector } from '../support/common';

testPlaywright.describe.serial('Bridge', () => {
    testPlaywright.beforeAll(async () => {
        // We make sure that bridge from cerberus-user-env is stopped.
        // So we properly test the electron app starting node-bridge module.
        await CerberusUserEnvLink.api.cerberusUserEnvConnect();
        await CerberusUserEnvLink.api.stopBridge();
    });

    testPlaywright('App spawns bundled bridge and stops it after app quit', async ({ request }) => {
        const suite = await launchSuite();
        const title = await suite.window.title();
        expectPlaywright(title).toContain('Cerberus Suite');

        // We wait for `@welcome/title` or `@dashboard/graph` since
        // one or the other will be display depending on the state of the app
        // due to previously run tests. And both means the same for the porpoise of this test.
        // Bridge should be ready to check `/status` endpoint.
        await Promise.race([
            waitForDataTestSelector(suite.window, '@welcome/title'),
            waitForDataTestSelector(suite.window, '@dashboard/graph'),
        ]);

        // bridge is running
        const bridgeRes1 = await request.get('http://127.0.0.1:21425/status/');
        await expectPlaywright(bridgeRes1).toBeOK();

        await suite.electronApp.close();

        // bridge is not running
        try {
            await request.get('http://127.0.0.1:21425/status/');
            throw new Error('should have thrown!');
        } catch (err) {
            // ok
        }
    });
});
