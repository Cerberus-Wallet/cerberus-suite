// origin: https://github.com/Cerberus-Wallet/connect/blob/develop/src/js/webusb/button.js

const render = (className = '', url: string) => {
    const query = className || '.cerberus-webusb-button';
    const buttons = document.querySelectorAll(query);
    const src = `${url}?${Date.now()}`;

    buttons.forEach(b => {
        if (b.getElementsByTagName('iframe').length < 1) {
            const bounds = b.getBoundingClientRect();
            const btnIframe = document.createElement('iframe') as HTMLIFrameElement;
            btnIframe.frameBorder = '0';
            btnIframe.width = `${Math.round(bounds.width)}px`;
            btnIframe.height = `${Math.round(bounds.height)}px`;
            btnIframe.style.position = 'absolute';
            btnIframe.style.top = '0px';
            btnIframe.style.left = '0px';
            btnIframe.style.zIndex = '1';
            // btnIframe.style.opacity = '0'; // this makes click impossible on cross-origin
            btnIframe.setAttribute('allow', 'usb');
            btnIframe.setAttribute('scrolling', 'no');
            btnIframe.src = src;

            // inject iframe into button
            b.append(btnIframe);
        }
    });
};

export default render;
