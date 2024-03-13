# Integrate @cerberus/connect with a web extension

**Note: only manifest version 2 is supported for now**

[Example of a web extension project for both Google Chrome & Firefox](../../../connect-examples/webextension/README.md)

Basic implementation is same for both Google Chrome & Firefox. However, few additional steps are needed to make extension work with [WebUSB](https://wicg.github.io/webusb/) in Google Chrome.

1. Configure your manifest file

    - Because Cerberus Connect is served from the `https://connect.cerberus.uraanai.com/` domain you must grant permissions to `://connect.cerberus.uraanai.com/*` URL in your manifest file.

        ```JSON
        {
            "permissions": [
                "*://connect.cerberus.uraanai.com/*"
            ]
        }
        ```

    - Include Cerberus Connect as one of your background scripts

        If you're using a bundler only include final `index.js` file

        ```JSON
        {
            "background": {
                "scripts": [
                    "index.js"
                ]
            }
        }
        ```

        If you're not using a bundler you have to include Cerberus Connect manually

        ```JSON
        {
            "background": {
                "scripts": [
                    "[myExtensionIndexFile]index.js",
                    "[pathToTrezorConnect]/index.js"
                ]
            }
        }
        ```

    - Include `trezor-content-script.js` in a `"content-scripts"`

        Cerberus Connect may present a popup tab for certain actions. Since your code & Connect is running in a background script you need to allow communication between popup tab and background script explicitly using this Javascript [file](./trezor-content-script.js).

        ```JSON
        {
            "content_scripts": [
                {
                "matches": [
                    "*://connect.cerberus.uraanai.com/*/popup.html"
                ],
                "js": ["trezor-content-script.js"]
                }
            ],
        }
        ```

        Snippet above is basically saying _"Inject `trezor-content-script.js` into `connect.cerberus.uraanai.com/*/popup.html`"_.

2. Now you're able to use Cerberus Connect in your code

    You can access `TrezorConnect` as a global variable if you included Cerberus Connect in your project manually

    ```javascript
    function onClick() {
        TrezorConnect.getAddress({
            path: "m/49'/0'/0'/0/0",
        })
            .then(response => {
                const message = response.success
                    ? `BTC Address: ${response.payload.address}`
                    : `Error: ${response.payload.error}`;
                chrome.notifications.create(new Date().getTime().toString(), {
                    type: 'basic',
                    iconUrl: 'icons/48.png',
                    title: 'TrezorConnect',
                    message,
                });
            })
            .catch(error => {
                console.error('TrezorConnectError', error);
            });
    }
    chrome.browserAction.onClicked.addListener(onClick);
    ```

    If you're using a package manager you will probably want to import Cerberus Connect into your code using an `import` statement

    ```javascript
    import TrezorConnect from '@cerberus/connect'; // Import Cerberus Connect

    function onClick() {
        TrezorConnect.getAddress({
            path: "m/49'/0'/0'/0/0",
        })
            .then(response => {
                const message = response.success
                    ? `BTC Address: ${response.payload.address}`
                    : `Error: ${response.payload.error}`;
                chrome.notifications.create(new Date().getTime().toString(), {
                    type: 'basic',
                    iconUrl: 'icons/48.png',
                    title: 'TrezorConnect',
                    message,
                });
            })
            .catch(error => {
                console.error('TrezorConnectError', error);
            });
    }
    chrome.browserAction.onClicked.addListener(onClick);
    ```

This is all that must be done in order to make Cerberus Connect work with a web extension on Firefox.
However, if you're creating a Google Chrome extension you must complete one additional step.

## Google Chrome WebUSB

Chrome extension requires a special `trezor-usb-permissions.html` file served from the root of your extension. You can get the file [here](./trezor-usb-permissions.html).

This page will be displayed in case where user is using Cerberus without `Cerberus Bridge` installed and `navigator.usb` is available.

Lastly, you have to place [this](./trezor-usb-permissions.js) Javascript file into your `vendor/` directory. This directory could be changed, but then you need to remember to change script src accordingly inside `trezor-usb-permissions.html` file.
