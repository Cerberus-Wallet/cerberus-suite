# @cerberus/connect-iframe

Build `@cerberus/connect` `iframe`, which enables secure communication with [@cerberus/connect-web](../connect-web) for third parties and web version of Suite. Official versions of the `iframe` are hosted on `connect.cerberus.uraanai.com/<version>/iframe.html`

## Usage

This build is then used in web version of Suite.
Build files are copied into `suite-*/build/static` directory during app build a defined in [@cerberus/suite-build](../suite-build).

## Build

`yarn workspace @cerberus/connect-iframe build`

## Motivation

Third-party apps and browser extensions connecting to Cerberus must use [@cerberus/connect-web](../connect-web) loaded into an `iframe` hosted at `connect.cerberus.uraanai.com` to ensure secure communication. Requests from self-hosted implementations on other domains will be rejected.

For `suite-*` builds, self-hosted `@cerberus/connect` build is used, so the `iframe` is hosted on `localhost` during development or on `cerberus.uraanai.com` domain in production.
