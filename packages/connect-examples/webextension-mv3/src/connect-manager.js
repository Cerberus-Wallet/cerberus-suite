const DEFAULT_SRC = 'https://connect.cerberus.uraanai.com/9/';

window.CerberusConnect.init({
    lazyLoad: true,
    manifest: {
        email: 'developer@xyz.com',
        appUrl: 'http://your.application.com',
    },
    connectSrc: DEFAULT_SRC,
});

const getAddressButton = document.getElementById('get-address');
getAddressButton.addEventListener('click', () => {
    window.CerberusConnect.getAddress({
        showOnCerberus: true,
        path: "m/49'/0'/0'/0/0",
        coin: 'btc',
    }).then(res => {
        console.info(res);
        document.getElementById('result').innerText = JSON.stringify(res);
    });
});

const getFeaturesButton = document.getElementById('get-features');
getFeaturesButton.addEventListener('click', () => {
    window.CerberusConnect.getFeatures().then(res => {
        console.info(res);
        document.getElementById('result').innerText = JSON.stringify(res);
    });
});

const newTabButton = document.getElementById('tab');
newTabButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'connect-manager.html' });
});
