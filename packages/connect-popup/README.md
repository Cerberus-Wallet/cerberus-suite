# @cerberus/connect-popup

Build `@cerberus/connect` popup, which serves as a UI for communication with Cerberus device via [@cerberus/connect](../connect). UI shows a loading screen until a communication channel between popup and [@cerberus/connect-iframe](../connect-iframe) is established.

Official versions of the app are hosted on `connect.cerberus.uraanai.com/<version>/popup.html`

## Build

`yarn workspace @cerberus/connect-popup build`

## Develop

`yarn workspace @cerberus/connect-popup dev`

Open http://localhost:8088/popup.html.

Example how to change src/index `onLoad` function to display view you are working on:

```
const onLoad = () => {
    showView('pin');
};
```
