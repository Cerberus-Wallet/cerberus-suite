// import { resolveConfig } from 'detox/internals';
import { expect as detoxExpect } from 'detox';

// import { TrezorUserEnvLink } from '@trezor/trezor-user-env-link';
// const platform = device.getPlatform();

// const TREZOR_DEVICE_LABEL = 'Trezor T - Tester';

const sleep = t => new Promise(res => setTimeout(res, t));

// const getDeepLinkUrl = (url: string) =>
//     `eastestsexample://expo-development-client/?url=${encodeURIComponent(url)}`;

// const getDevLauncherPackagerUrl = (plat: string) =>
//     `http://localhost:8081/index.bundle?platform=${plat}&dev=true&minify=false&disableOnboarding=1`;

// async function openAppForDebugBuild(plat: string) {
//     const deepLinkUrl = getDeepLinkUrl(getDevLauncherPackagerUrl(plat));

//     if (plat === 'ios') {
//         await device.launchApp({
//             newInstance: true,
//         });
//         sleep(3000);
//         await device.openURL({
//             url: deepLinkUrl,
//         });
//     } else {
//         await device.launchApp({
//             newInstance: true,
//             url: deepLinkUrl,
//         });
//     }

//     await sleep(3000);
// }

// async function openApp() {
//     const { configurationName } = await resolveConfig();

//     return await openAppForDebugBuild(platform);

//     console.log(X);

//     // if (config.configurationName.split('.')[1] === 'debug') {
//     // } else {
//     //     return await device.launchApp({
//     //         newInstance: true,
//     //     });
//     // }
// }

describe('Start discovery', () => {
    beforeAll(async () => {
        await sleep(3000);

        return await device.launchApp();
        // await TrezorUserEnvLink.api.trezorUserEnvConnect();
        // await TrezorUserEnvLink.api.startEmu({ wipe: true });
        // await TrezorUserEnvLink.api.setupEmu({ label: TREZOR_DEVICE_LABEL });
        // await TrezorUserEnvLink.api.startBridge();
        // await TrezorUserEnvLink.api.stopEmu();
        // await openApp();
        // await device.setURLBlacklist(['.*127.0.0.1.*']);
    });

    // afterAll(async () => {
    //     await TrezorUserEnvLink.api.trezorUserEnvDisconnect();
    // });

    it('Redirect from first to second screen', async () => {
        await sleep(3000);
        await element(by.id('@onboarding/Welcome/nextBtn')).tap();

        //  TODO: handle IOS screen
        await sleep(3000);

        await detoxExpect(element(by.id('@onboarding/ConnectTrezor/nextBtn'))).toBeVisible();
        await sleep(3000);

        await element(by.id('@onboarding/ConnectTrezor/nextBtn')).tap();
        await sleep(3000);

        await element(by.id('@onboarding/AboutReceiveCoinsFeature/nextBtn')).tap();
        await sleep(3000);

        await element(by.id('@onboarding/TrackBalances/nextBtn')).tap();
        await sleep(3000);

        await detoxExpect(element(by.id('@onboarding/UserDataConsent/allow'))).toBeVisible();
        await sleep(3000);

        await element(by.id('@onboarding/UserDataConsent/allow')).tap();

        // reject biometrics bottom sheet
        // await element(by.id('reject-biometrics')).tap();

        // await device.setURLBlacklist([]);
        // await TrezorUserEnvLink.api.startEmu();

        // await sleep(8000);

        // await device.disableSynchronization();

        // await detoxExpect(element(by.text(TREZOR_DEVICE_LABEL))).toBeVisible();
        // await detoxExpect(element(by.text('My portfolio balance'))).toBeVisible();

        // await TrezorUserEnvLink.api.trezorUserEnvDisconnect();

        // await expect(element(by.text('Connect'))).toBeVisible();
    });
});
