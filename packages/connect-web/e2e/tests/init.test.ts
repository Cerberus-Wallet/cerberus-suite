import { test, expect } from '@playwright/test';

test.beforeAll(async () => {});

const inlineScriptUrl = process.env.URL
    ? // url of build from CI
      `${process.env.URL}/cerberus-connect.js`
    : // for testing out on localhost
      'https://connect.cerberus.uraanai.com/9/cerberus-connect.js';

const fixtures = [
    {
        params: {
            connectSrc: '',
        },
        result: 'https://connect.cerberus.uraanai.com/9/iframe.html',
    },
    {
        params: {
            connectSrc: 'https://connect.cerberus.uraanai.com/9.0.1/',
        },
        result: 'https://connect.cerberus.uraanai.com/9.0.1/iframe.html',
    },
    {
        // it is even possible to load old connect version 8
        params: {
            connectSrc: 'https://connect.cerberus.uraanai.com/8/',
        },
        result: 'https://connect.cerberus.uraanai.com/8/iframe.html',
    },
];

fixtures.forEach(f => {
    test(`CerberusConnect.init ${JSON.stringify(f.params)} => ${f.result}`, async ({ page }) => {
        await page.addScriptTag({ url: inlineScriptUrl });
        await page.addScriptTag({
            content: `
                window.CerberusConnect.init({
                    lazyLoad: false,
                    manifest: {
                        email: 'developer@xyz.com',
                        appUrl: 'http://your.application.com',
                    },
                    connectSrc: '${f.params.connectSrc}'
                });
        `,
        });
        const iframeSrc = await page.locator('iframe').getAttribute('src');
        expect(iframeSrc).toContain(f.result);
    });
});
