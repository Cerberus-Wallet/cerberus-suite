# @cerberus/connect-popup

@cerberus/connect-popup is end-to-end tested together with @cerberus/connect-explorer using [playwright test runner](https://playwright.dev/).

#### Playwright + NixOS

Before the first run or occasionally after the update of npm dependencies you will be asked to run `playwright install` command:

```
Error: browserType.launch: Executable doesn't exist at .cache/ms-playwright/chromium-[revision]/chrome-linux/chrome

Please run the following command to download new browsers:
npx playwright install

```

Playwright requires specific revisions defined in `node_modules/playwright-core/browsers.json`.
Unfortunately downloaded browsers are not compatible with NixOS.

Link your system browser instead of downloading:

```
FILE=path-from-the-error && mkdir -p "${FILE%/*}" && touch "$FILE" && ./nixos-fix-binaries.sh
```

## Fixtures

Fixtures are located in [packages/connect-popup](https://github.com/Cerberus-Wallet/cerberus-suite/tree/develop/packages/connect-popup/e2e/tests)

## Test results

Checkout [latest screenshots](https://gitlab.com/satoshilabs/cerberus/cerberus-suite/-/jobs/artifacts/develop/file/packages/connect-popup/connect-popup-overview.html?job=connect-popup%3A%20%5Bmethods.test%5D)
