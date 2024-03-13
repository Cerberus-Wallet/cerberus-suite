type CerberusConnectIpcChannel = (method: string, ...params: any[]) => Promise<any>;

interface Window {
    CerberusConnectIpcChannel?: CerberusConnectIpcChannel; // Electron API
}
