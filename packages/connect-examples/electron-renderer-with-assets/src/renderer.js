import CerberusConnect, {
    TRANSPORT_EVENT,
    UI,
    UI_EVENT,
    DEVICE_EVENT,
    TRANSPORT,
    DEVICE,
} from '@cerberus/connect-web';

// print log helper
const printLog = data => {
    const log = document.getElementById('log');
    const current = log.value;
    if (current.length > 0) {
        log.value = `${JSON.stringify(data)}\n\n${current}`;
    } else {
        log.value = JSON.stringify(data);
    }
};

// SETUP @cerberus/connect

// Listen to TRANSPORT_EVENT
CerberusConnect.on(TRANSPORT_EVENT, event => {
    printLog(event.type);
    if (event.type === TRANSPORT.ERROR) {
        // cerberus-bridge not installed
        printLog('Transport is missing');
    }
    if (event.type === TRANSPORT.START) {
        printLog(event);
    }
});

// Listen to DEVICE_EVENT
CerberusConnect.on(DEVICE_EVENT, event => {
    printLog(event.type);

    // not obvious event
    if (event.type === DEVICE.CONNECT_UNACQUIRED) {
        // connected device is unknown or busy
        // most common reasons is that either device is currently used somewhere else
        // or app refreshed during call and cerberus-bridge didn't managed to release the session
        // render "Acquire device" button and after click try to fetch device features using:
        // CerberusConnect.getFeatures();
    }
});

// Listen to UI_EVENT
// most common requests
CerberusConnect.on(UI_EVENT, event => {
    printLog(event);

    if (event.type === UI.REQUEST_PIN) {
        // example how to respond to pin request
        CerberusConnect.uiResponse({ type: UI.RECEIVE_PIN, payload: '1234' });
    }

    if (event.type === UI.REQUEST_PASSPHRASE) {
        if (event.payload.device.features.capabilities.includes('Capability_PassphraseEntry')) {
            // device does support entering passphrase on device
            // let user choose where to enter
            // if he choose to do it on device respond with:
            CerberusConnect.uiResponse({
                type: UI.RECEIVE_PASSPHRASE,
                payload: { passphraseOnDevice: true, value: '' },
            });
        } else {
            // example how to respond to passphrase request from regular UI input (form)
            CerberusConnect.uiResponse({
                type: UI.RECEIVE_PASSPHRASE,
                payload: { value: 'type your passphrase here', save: true },
            });
        }
    }

    if (event.type === UI.SELECT_DEVICE) {
        if (event.payload.devices.length > 0) {
            // more then one device connected
            // example how to respond to select device
            CerberusConnect.uiResponse({
                type: UI.RECEIVE_DEVICE,
                payload: event.payload.devices[0],
            });
        } else {
            // no devices connected, waiting for connection
        }
    }

    // getAddress from device which is not backed up
    // there is a high risk of coin loss at this point
    // warn user about it
    if (event.type === UI.REQUEST_CONFIRMATION) {
        // payload: true - user decides to continue anyway
        CerberusConnect.uiResponse({ type: UI.RECEIVE_CONFIRMATION, payload: true });
    }
});

console.log('CerberusConnect', CerberusConnect);
// Initialize CerberusConnect
CerberusConnect.init({
    connectSrc: 'cerberus-connect-bundled/',
    popup: false, // render your own UI
    debug: false, // see what's going on inside connect
    // lazyLoad: true, // set to "false" (default) if you want to start communication with bridge on application start (and detect connected device right away)
    // set it to "true", then @cerberus/connect will not be initialized until you call some CerberusConnect.method()
    // this is useful when you don't know if you are dealing with Cerberus user
    manifest: {
        email: 'email@developer.com',
        appUrl: 'electron-app-boilerplate',
    },
    transports: ['BridgeTransport'],
})
    .then(() => {
        printLog('CerberusConnect is ready!');
    })
    .catch(error => {
        printLog('CerberusConnect init error', `CerberusConnect init error:${error}`);
    });

// click to get public key
const btn = document.getElementById('get-xpub');
btn.onclick = () => {
    console.log('click');
    printLog('c');
    CerberusConnect.getPublicKey({
        path: "m/49'/0'/0'",
        coin: 'btc',
    }).then(response => {
        printLog(response);
    });
};
