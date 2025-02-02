// CerberusConnect is injected as inline script in html
// therefore it doesn't need to included into node_modules
// get reference straight from window object
const { CerberusConnect } = window;

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

// Listen to DEVICE_EVENT
// this event will be emitted only after user grants permission to communicate with this app
CerberusConnect.on('DEVICE_EVENT', event => {
    printLog(event);
});

// Initialize CerberusConnect
CerberusConnect.init({
    debug: false, // see whats going on inside iframe
    lazyLoad: true, // set to "false" (default) if you want to start communication with bridge on application start (and detect connected device right away)
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
        printLog(`CerberusConnect init error: ${error}`);
    });

// click to get public key
const btn = document.getElementById('get-xpub');
btn.onclick = () => {
    CerberusConnect.getPublicKey({
        path: "m/49'/0'/0'",
        coin: 'btc',
    }).then(response => {
        printLog(response);
    });
};
