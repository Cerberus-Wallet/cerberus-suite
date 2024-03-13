# @cerberus/connect-web

[![Build Status](https://github.com/Cerberus-Wallet/cerberus-suite/actions/workflows/connect-test.yml/badge.svg)](https://github.com/Cerberus-Wallet/cerberus-suite/actions/workflows/connect-test.yml)
[![NPM](https://img.shields.io/npm/v/@cerberus/connect-web.svg)](https://www.npmjs.org/package/@cerberus/connect-web)
[![Known Vulnerabilities](https://snyk.io/test/github/trezor/connect-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/trezor/trezor-suite?targetFile=packages/connect-web/package.json)

This package is bundled into web implementations. User interface is presented in a secure popup window served from `connect.cerberus.uraanai.com/<version>/popup.html`. To try it out, use [@cerberus/connect-explorer](https://github.com/Cerberus-Wallet/cerberus-suite/tree/develop/packages/connect-explorer) hosted [here](https://trezor.github.io/trezor-suite/connect-explorer).

Contains minimum of code required to:

-   Define `TrezorConnect` API object
-   Create and handle communication between `@cerberus/connect-iframe` hosted on `https://connect.cerberus.uraanai.com/<version>/iframe.html`
-   Create and handle communication and lifecycle of `@cerberus/connect-popup` hosted on `https://connect.cerberus.uraanai.com/<version>/popup.html`

## Installation

Install library as npm module:

```javascript
npm install @cerberus/connect-web
```

or

```javascript
yarn add @cerberus/connect-web
```

Include library as inline script:

```javascript
<script src="https://connect.cerberus.uraanai.com/9/trezor-connect.js"></script>
```

## Initialization

ES6

```javascript
import TrezorConnect from '@cerberus/connect-web';
```

Inline

```javascript
var TrezorConnect = window.TrezorConnect;
```

For more instructions [refer to this document](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/docs/packages/connect/index.md)

## Development

-   clone repository: `git clone git@github.com:trezor/trezor-suite.git`
-   install node_modules: `yarn && yarn build:libs`
-   generate certs `yarn workspace @cerberus/connect-web predev`
-   It is possible to run local dev server with iframe and popup using: `yarn workspace @cerberus/connect-web dev` Note: don't forget to visit `https://localhost:8088/` and allow self-signed certificate. No UI is displayed here.
