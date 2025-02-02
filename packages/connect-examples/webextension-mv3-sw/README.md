# Web extension manifest V3 example using service worker

`@cerberus/connect-webextension` running in a `service worker` and communicating with `@cerberus/popup` (which loads core logic) through `chrome.runtime` messages.

Tested in Chrome

## Install

Run the commands below in order to get the webextension ready to be loaded in the browser.

-   `yarn`
-   `yarn build:libs`
-   `yarn workspace @cerberus/connect-webextension build`
-   `node packages/connect-examples/update-webextensions-sw.js`
-   `yarn workspace @cerberus/connect-iframe build:core-module`
-   `yarn workspace @cerberus/connect-popup dev`

This extension is super simple and only reacts to "reload" button.

## Browsers

### Chrome

-   Go to chrome://extensions
-   Enable developer mode and load unpacked
-   Choose `packages/connect-examples/webextension-mv3-sw` directory
