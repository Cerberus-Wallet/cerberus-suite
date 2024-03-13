# Connect explorer in a webextension

This packages aims to use connect-explorer in the context of a webextension in order to reuse the tests we have to test all the connect features in different contexts. It also serves as example for third party implementers of TrezorConnect in webextension.

## Development

Run it for dev:

```
yarn && \
yarn build:libs && \
yarn workspace @cerberus/connect-webextension build && \
yarn workspace @cerberus/connect-iframe build:core-module && \
yarn workspace @cerberus/connect-explorer build:webextension && \
yarn workspace @cerberus/connect-popup dev
```
