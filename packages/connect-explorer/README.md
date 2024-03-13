# @cerberus/connect-explorer

This package serves as:

-   an interactive documentation for [@cerberus/connect](../connect) package
-   a referential implementation of [@cerberus/connect-web](../connect-web) in "popup mode"

To run the explorer locally:

`yarn workspace @cerberus/connect-explorer dev` - runs dev server on port 8088

## Examples

-   [production](https://connect.cerberus.uraanai.com/9/). This build allows working with restricted methods (management) since it is hosted on a whitelisted domain.
-   [non-whitelisted domain](https://trezor.github.io/trezor-suite/connect-explorer), which is pointing to the latest stable version of [@cerberus/connect](../connect). This build effectively simulates 3rd party integration.
-   [develop](https://suite.corp.sldev.cz/connect-explorer/develop) Branches builds available for here for internal use.

## Webusb

When `connect-explorer` is run locally, WebUSB is disabled because [@cerberus/connect-popup](../connect-popup) runs on a different domain and Chrome does not allow `navigator.usb.requestDevice` calls between cross-site elements since v72. Further investigation needed to see if we can fix that. Until then, run [Bridge](https://suite.cerberus.uraanai.com/web/bridge/) to connect to Cerberus.
