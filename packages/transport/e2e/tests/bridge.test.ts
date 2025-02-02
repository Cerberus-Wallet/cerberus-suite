import * as messages from '@cerberus/protobuf/messages.json';
// testing build. yarn workspace @cerberus/transport build:lib is a required step therefore
import { CerberusUserEnvLink } from '@cerberus/cerberus-user-env-link';

// testing build. yarn workspace @cerberus/transport build:lib is a required step therefore
import { BridgeTransport } from '../../lib';

// todo: introduce global jest config for e2e
jest.setTimeout(60000);

const mnemonicAll = 'all all all all all all all all all all all all';

const emulatorSetupOpts = {
    mnemonic: mnemonicAll,
    pin: '',
    passphrase_protection: false,
    label: 'CerberusT',
    needs_backup: true,
};

const emulatorStartOpts = { version: '2-main', wipe: true };

describe('bridge', () => {
    beforeAll(async () => {
        await CerberusUserEnvLink.connect();
    });

    afterAll(async () => {
        await CerberusUserEnvLink.send({ type: 'emulator-stop' });
        await CerberusUserEnvLink.send({ type: 'bridge-stop' });
        CerberusUserEnvLink.disconnect();
    });

    // there might be more versions of bridge out there, see https://github.com/Cerberus-Wallet/webwallet-data/tree/master/bridge
    // but they are not available from cerberus-user-env, see https://github.com/Cerberus-Wallet/cerberus-user-env/tree/master/src/binaries/cerberusd-go/bin
    ['2.0.26', '2.0.27', undefined].forEach(bridgeVersion => {
        describe(bridgeVersion || 'latest', () => {
            let bridge: any;
            let devices: any[];
            let session: any;
            beforeEach(async () => {
                // todo: swapping emulator-stop and bridge-stop line can simulate "emulator process died" error
                await CerberusUserEnvLink.send({ type: 'emulator-stop' });
                await CerberusUserEnvLink.send({ type: 'bridge-stop' });
                await CerberusUserEnvLink.send({ type: 'emulator-start', ...emulatorStartOpts });
                await CerberusUserEnvLink.send({ type: 'emulator-setup', ...emulatorSetupOpts });
                await CerberusUserEnvLink.send({ type: 'bridge-start', version: bridgeVersion });

                bridge = new BridgeTransport({ messages });
                await bridge.init().promise;

                const enumerateResult = await bridge.enumerate().promise;
                expect(enumerateResult).toEqual({
                    success: true,
                    payload: [
                        {
                            path: '1',
                            session: null,
                            product: 0,
                            vendor: 0,
                            // we don't use it but bridge returns
                            debug: true,
                            debugSession: null,
                        },
                    ],
                });
                devices = enumerateResult.payload;

                const acquireResult = await bridge.acquire({ input: { path: devices[0].path } })
                    .promise;
                expect(acquireResult).toEqual({
                    success: true,
                    payload: '1',
                });
                session = acquireResult.payload;
            });

            test(`call(GetFeatures)`, async () => {
                const message = await bridge.call({ session, name: 'GetFeatures', data: {} })
                    .promise;
                expect(message).toMatchObject({
                    success: true,
                    payload: {
                        type: 'Features',
                        message: {
                            vendor: 'cerberus.uraanai.com',
                            label: 'CerberusT',
                        },
                    },
                });
            });

            test(`send(GetFeatures) - receive`, async () => {
                const sendResponse = await bridge.send({ session, name: 'GetFeatures', data: {} })
                    .promise;
                expect(sendResponse).toEqual({ success: true, payload: undefined });

                const receiveResponse = await bridge.receive({ session }).promise;
                expect(receiveResponse).toMatchObject({
                    success: true,
                    payload: {
                        type: 'Features',
                        message: {
                            vendor: 'cerberus.uraanai.com',
                            label: 'CerberusT',
                        },
                    },
                });
            });

            test(`call(ChangePin) - send(Cancel) - receive`, async () => {
                // initiate change pin procedure on device
                const callResponse = await bridge.call({ session, name: 'ChangePin', data: {} })
                    .promise;
                expect(callResponse).toMatchObject({
                    success: true,
                    payload: {
                        type: 'ButtonRequest',
                    },
                });

                // cancel change pin procedure
                const sendResponse = await bridge.send({ session, name: 'Cancel', data: {} })
                    .promise;
                expect(sendResponse).toEqual({ success: true, payload: undefined });

                // receive response
                const receiveResponse = await bridge.receive({ session }).promise;
                expect(receiveResponse).toMatchObject({
                    success: true,
                    payload: {
                        type: 'Failure',
                        message: {
                            code: 'Failure_ActionCancelled',
                            message: 'Cancelled',
                        },
                    },
                });

                // validate that we can continue with communication
                const message = await bridge.call({
                    session,
                    name: 'GetFeatures',
                    data: {},
                }).promise;
                expect(message).toMatchObject({
                    success: true,
                    payload: {
                        type: 'Features',
                        message: {
                            vendor: 'cerberus.uraanai.com',
                            label: 'CerberusT',
                        },
                    },
                });
            });

            test(`call(Backup) - send(Cancel) - receive`, async () => {
                // initiate backup procedure on device
                const callResponse = await bridge.call({ session, name: 'BackupDevice', data: {} })
                    .promise;
                expect(callResponse).toMatchObject({
                    success: true,
                    payload: {
                        type: 'ButtonRequest',
                    },
                });

                // cancel backup procedure
                const sendResponse = await bridge.send({ session, name: 'Cancel', data: {} })
                    .promise;
                expect(sendResponse).toEqual({ success: true });

                // receive response
                const receiveResponse = await bridge.receive({ session }).promise;
                expect(receiveResponse).toMatchObject({
                    success: true,
                    payload: {
                        type: 'Failure',
                        message: {
                            code: 'Failure_ActionCancelled',
                            message: 'Cancelled',
                        },
                    },
                });

                // validate that we can continue with communication
                const message = await bridge.call({ session, name: 'GetFeatures', data: {} })
                    .promise;
                expect(message).toMatchObject({
                    success: true,
                    payload: {
                        type: 'Features',
                        message: {
                            vendor: 'cerberus.uraanai.com',
                            label: 'CerberusT',
                        },
                    },
                });
            });
        });
    });
});
