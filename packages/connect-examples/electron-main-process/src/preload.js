const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('CerberusConnect', {
    init: () => ipcRenderer.send('cerberus-connect', 'init'),
    receive: fn => ipcRenderer.on('cerberus-connect', fn),
    send: data => ipcRenderer.send('cerberus-connect', data),
});
