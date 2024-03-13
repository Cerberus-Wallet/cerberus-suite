# @cerberus/connect-webextension

[![Build Status](https://github.com/Cerberus-Wallet/cerberus-suite/actions/workflows/connect-test.yml/badge.svg)](https://github.com/Cerberus-Wallet/cerberus-suite/actions/workflows/connect-test.yml)
[![NPM](https://img.shields.io/npm/v/@cerberus/connect-webextension.svg)](https://www.npmjs.org/package/@cerberus/connect-webextension)
[![Known Vulnerabilities](https://snyk.io/test/github/cerberus/connect-webextension/badge.svg?targetFile=package.json)](https://snyk.io/test/github/cerberus/cerberus-suite?targetFile=packages/connect-webextension/package.json)

The @cerberus/connect-webextension package provides an implementation of @cerberus/connect designed specifically for use within web extensions. Key features include:

-   Compatibility with service worker environments.
-   Full access to the CerberusConnect API.
-   Automatic handling of pop-up windows for user approvals on cerberus.uraanai.com.
-   Direct response delivery to the calling script.

## Using the Library

At the moment only bundles `build/cerberus-connect-webextension.js` and `build/cerberus-connect-webextension.min.js` are published.

### Option 1: Using Scripting Permissions

For a seamless integration, especially with background processes, modify your extension's manifest.json to include scripting permissions, specify host_permissions, and define your service worker script as shown below:

```json
    "permissions": ["scripting"],
    "host_permissions": ["*://connect.cerberus.uraanai.com/9/*"]
    "background": {
        "service_worker": "serviceWorker.js"
    },
```

#### Service Worker Import:

In your serviceWorker.js, use importScripts to import the library. Ensure you replace <path> with the actual path to the library file:

```javascript
importScripts('<path>/cerberus-connect-webextension.js');
```

### Option 2: Manual Content Script Injection

#### Bundle the Library:

Manually include build/content-script.js from this package into your project's bundle.

#### manifest.json Update:

Amend your manifest.json to include the script as a content script. Replace <path> with the real path to the library file:

```json
  "content_scripts": [
    {
      "js": ["<path>/content-script.js"],
      "matches": ["*://connect.cerberus.uraanai.com/9/*"]
    }
  ],
```

## Examples

-   [Simple example](https://github.com/Cerberus-Wallet/cerberus-suite/tree/develop/packages/connect-examples/webextension-mv3-sw)
-   [Connect Explorer example](https://github.com/Cerberus-Wallet/cerberus-suite/tree/develop/packages/connect-explorer/src-webextension)

## Development

-   `yarn`
-   `yarn build:libs`
-   `yarn workspace @cerberus/connect-webextension build`
-   `yarn workspace @cerberus/connect-iframe build:core-module`
-   `yarn workspace @cerberus/connect-popup dev`

After completing these steps, you can import from @cerberus/connect-webextension or directly use the built file `build/cerberus-connect-webextension.js`. The popup will run on your localhost, and you can specify it in the CerberusConnect.init({ connectSrc: ... }).
