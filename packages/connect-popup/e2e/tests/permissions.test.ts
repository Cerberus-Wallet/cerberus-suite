import { test, chromium, Page } from '@playwright/test';
import { CerberusUserEnvLink } from '@cerberus/cerberus-user-env-link';
import { setConnectSettings } from '../support/helpers';

const url = process.env.URL || 'http://localhost:8088/';

let popup: Page;

test.beforeAll(async () => {
    await CerberusUserEnvLink.connect();
    await CerberusUserEnvLink.api.stopEmu();
    await CerberusUserEnvLink.api.stopBridge();
    await CerberusUserEnvLink.api.startEmu({ wipe: true });
    await CerberusUserEnvLink.api.setupEmu({ passphrase_protection: false });
    await CerberusUserEnvLink.api.startBridge();
});

const fixtures = [
    {
        description:
            'iframe and host same origins but with settings to trustedHost -> no permissions shown',
        queryString: '',
        setTrustedHost: true,
        expect: () =>
            popup.waitForSelector('//p[contains(., "Follow instructions on your device")]', {
                state: 'visible',
                strict: false,
            }),
    },
    {
        description:
            'iframe and host same origins but with settings to NOT trustedHost -> show permissions',
        queryString: '',
        setTrustedHost: false,
        expect: () => popup.waitForSelector("[data-test='@permissions/confirm-button']"),
    },
];

fixtures.forEach(f => {
    test(f.description, async () => {
        const browserInstance = await chromium.launch();
        const page = await browserInstance.newPage();
        if (f.setTrustedHost) {
            await setConnectSettings(page, url, { trustedHost: true });
        }
        await page.goto(`${url}${f.queryString}#/method/verifyMessage`);

        [popup] = await Promise.all([
            page.waitForEvent('popup'),
            page.click("button[data-test='@submit-button']"),
        ]);

        await f.expect();
        await browserInstance.close();
    });
});
