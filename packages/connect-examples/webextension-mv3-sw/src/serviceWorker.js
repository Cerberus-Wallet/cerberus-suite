// import connect
importScripts('vendor/cerberus-connect-webextension.js');

const connectSrc = 'https://connect.cerberus.uraanai.com/9/';

// call connect once extension is started. and thats all
chrome.runtime.onInstalled.addListener(details => {
    CerberusConnect.init({
        manifest: {
            email: 'meow',
            appUrl: 'https://yourAppUrl.com/',
        },
        transports: ['BridgeTransport', 'WebUsbTransport'],
        connectSrc,
    });

    CerberusConnect.on('DEVICE_EVENT', event => {
        console.log('EVENT in service worker', event);
    });
    CerberusConnect.ethereumGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnCerberus: true,
    }).then(res => {
        console.log('RESULT in service worker', res);
    });
});
