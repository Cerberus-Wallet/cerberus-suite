# Web extension manifest V3 example

`@cerberus/connect` running in an `html` page from the extension and communicating with `@cerberus/popup` through `chrome.runtime` messages.

Tested in Chrome

## Install

Run the commands below in order to get the MV2 and MV3 webextension ready to be loaded in the browser.

-   `yarn`
-   `yarn build:libs`
-   `yarn workspace @cerberus/connect-web build:webextension`
-   `yarn workspace @cerberus/connect-web build:inline`
-   `node packages/connect-examples/update-webextensions.js`

## Browsers

### Chrome

-   Go to chrome://extensions
-   Enable developer mode and load unpacked
-   Choose `packages/connect-examples/webextension-mv3` directory
