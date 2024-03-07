import { createTimeoutPromise } from '@trezor/utils';

import { DeviceList } from '../device/DeviceList';
import { UI, DEVICE, createUiMessage, createDeviceMessage, CoreEventMessage } from '../events';
import type { Device } from '../device/Device';
import { randomBytes } from 'crypto';
import {
    getBinary,
    uploadFirmware,
    getLanguage,
    calculateFirmwareHash,
    shouldStripFwHeaders,
    stripFwHeaders,
} from '../api/firmware';
import { TypedError } from '../constants/errors';
import { getReleases } from '../data/firmwareInfo';
import { CommonParams, IntermediaryVersion } from '..';
import type { Log } from '../utils/debug';

type PostMessage = (message: CoreEventMessage) => void;

const registerEvents = (device: Device, postMessage: PostMessage) => {
    device.on(DEVICE.BUTTON, (_d, request) => {
        postMessage(
            createDeviceMessage(DEVICE.BUTTON, {
                code: request.code,
                device: device.toMessageObject(),
            }),
        );
    });
};

const waitForReconnectedDevice = async ({
    params: { bootloader, manual, confirmOnDevice },
    context: { deviceList, device, postMessage, log },
}: {
    params: { bootloader: boolean; manual: boolean; confirmOnDevice: boolean };
    context: { deviceList: DeviceList; device: Device; postMessage: PostMessage; log: Log };
}): Promise<Device> => {
    let i = 0;
    log.debug(
        'onCallFirmwareUpdate',
        `waiting for device to reconnect in ${bootloader ? 'bootloader' : 'normal'} mode`,
    );
    postMessage(
        createUiMessage(UI.FIRMWARE_RECONNECT, {
            device: device.toMessageObject(),
            manual,
            bootloader,
            confirmOnDevice,
        }),
    );
    let reconnectedDevice: Device | undefined;

    do {
        await createTimeoutPromise(2000);
        try {
            reconnectedDevice = deviceList.getDevice(deviceList.getFirstDevicePath());
            // if (reconnectedDevice) {
            //     registerEvents(reconnectedDevice, postMessage);
            // }
        } catch (err) {
            console.log('catc herr', err);
        }
        i++;
        log.debug('onCallFirmwareUpdate', 'waiting for device to reconnect', i);
    } while (!reconnectedDevice || bootloader === !reconnectedDevice.features?.bootloader_mode);

    await reconnectedDevice.waitForFirstRun();
    await reconnectedDevice.acquire();

    return reconnectedDevice;
};

const waitForDisconnectedDevice = async ({
    params: { manual },
    context: { deviceList, device, postMessage, log },
}: {
    params: { manual: boolean };
    context: {
        deviceList: DeviceList;
        device: Device;
        postMessage: PostMessage;
        log: Log;
    };
}): Promise<void> => {
    log.debug('onCallFirmwareUpdate', 'waiting for device to disconnect');
    postMessage(
        createUiMessage(UI.FIRMWARE_DISCONNECT, {
            device: device.toMessageObject(),
            manual,
        }),
    );
    await new Promise(resolve => {
        deviceList.once('device-disconnect', resolve);
    });
};

const getInstallationParams = (device: Device, _params: Params) => {
    const support = {
        reboot_and_wait: device.atLeast(['1.10.0', '2.6.0']),
        // reboot_and_upgrade strictly requires updating to a higher version
        // todo: this is not supported for model one right?
        reboot_and_upgrade: device.atLeast('2.6.3') && !!device.firmwareRelease?.isNewer,
        language_data_length: device.atLeast('2.6.5'),
    };

    const manual = !support.reboot_and_wait && !support.reboot_and_upgrade;
    const upgrade = support.reboot_and_upgrade;
    const language = support.language_data_length;

    return {
        /** RebootToBootloader is not supported */
        manual,
        /** RebootToBootloader (REBOOT_AND_UPGRADE) is supported  */
        upgrade,
        /** Language update is supported */
        language,
    };
};

const getFwHeader = (binary: ArrayBuffer) => Buffer.from(binary.slice(0, 6000)).toString('hex');

// parametrized getBinary to save some lines of code

const getBinaryHelper = (
    device: Device,
    params: Params,
    log: Log,
    postMessage: PostMessage,
    intermediaryVersion?: IntermediaryVersion,
) => {
    if (!device.firmwareRelease) {
        throw TypedError('Runtime', 'device.firmwareRelease is not set');
    }
    const btcOnly = params.btcOnly || device.firmwareType === 'bitcoin-only';

    log.debug(
        'onCallFirmwareUpdate loading binary',
        'intermediaryVersion',
        device.firmwareRelease.intermediaryVersion,
        'version',
        device.firmwareRelease.release.version,
        'btcOnly',
        btcOnly,
    );

    postMessage(
        createUiMessage(UI.FIRMWARE_PROGRESS, {
            device: device.toMessageObject(),
            operation: 'downloading',
            progress: 0,
        }),
    );

    return getBinary({
        // features and releases are used for sanity checking
        features: device.features,
        releases: getReleases(device.features?.internal_model),
        // version argument is used to find and fetch concrete release from releases list,
        // at the moment, version is not passed in params, so which version is going to be installed is solely
        // decided by connect internals
        version: device.firmwareRelease.release.version,
        btcOnly,
        baseUrl: params.baseUrl!,
        intermediaryVersion,
    }).then(res => {
        postMessage(
            createUiMessage(UI.FIRMWARE_PROGRESS, {
                device: device.toMessageObject(),
                operation: 'downloading',
                progress: 100,
            }),
        );

        return res;
    });
};

const firmwareCheck = async (
    reconnectedDevice: Device,
    device: Device,
    stripped: ArrayBuffer,
    postMessage: PostMessage,
) => {
    postMessage(
        createUiMessage(UI.FIRMWARE_PROGRESS, {
            device: device.toMessageObject(),
            operation: 'validating',
            progress: 0,
        }),
    );
    const { hash, challenge } = calculateFirmwareHash(
        device.features.major_version,
        stripped,
        randomBytes(32),
    );

    const getFirmwareHashResponse = await reconnectedDevice
        .getCommands()
        .typedCall('GetFirmwareHash', 'FirmwareHash', { challenge });

    // needed? meh..
    postMessage(
        createUiMessage(UI.FIRMWARE_PROGRESS, {
            device: device.toMessageObject(),
            operation: 'validating',
            progress: 100,
        }),
    );

    return (
        // @ts-expect-error T1B1
        getFirmwareHashResponse.message !== 'Unknown message' &&
        // @ts-expect-error T2T1
        getFirmwareHashResponse.message !== 'Unexpected message' &&
        getFirmwareHashResponse.message.hash === hash
    );
};

export type Params = {
    language?: string;
    baseUrl?: string;
    btcOnly?: boolean;
    binary?: ArrayBuffer;
} & CommonParams;

export const onCallFirmwareUpdate = async ({
    params,
    deviceList,
    postMessage,
    initDevice,
    log,
}: {
    params: Params;
    deviceList: DeviceList;
    postMessage: PostMessage;
    initDevice: (path?: string) => Promise<Device>;
    log: Log;
}) => {
    log.debug('onCallFirmwareUpdate with params: ', params);

    const device = await initDevice(params?.device?.path);
    let reconnectedDevice: Device = device;

    log.debug('onCallFirmwareUpdate', 'device', device);

    registerEvents(device, postMessage);

    if (!device.firmwareRelease) {
        throw TypedError('Runtime', 'device.firmwareRelease is not set');
    }

    const { manual, upgrade, language } = getInstallationParams(device, params);

    log.debug('onCallFirmwareUpdate', 'installation params', { manual, upgrade, language });

    let binary =
        params.binary ||
        (await getBinaryHelper(
            device,
            params,
            log,
            postMessage,
            device.firmwareRelease.intermediaryVersion,
        ));

    // Might not be installed, but needed for calculateFirmwareHash anyway
    const stripped = stripFwHeaders(binary);

    log.debug('onCallFirmwareUpdate', 'binary loaded', binary);

    const deviceInitiallyConnectedInBootloader = device.features.bootloader_mode;

    if (!manual && deviceInitiallyConnectedInBootloader) {
        log.warn(
            'onCallFirmwareUpdate',
            'device is already in bootloader mode. language will not be updated',
        );
    }
    if (
        !manual &&
        // todo: this is sort of product question, if device is already in bootloader mode, we can't call RebootToBootloader which means we can't update device
        // language together with firmware update.
        !deviceInitiallyConnectedInBootloader
    ) {
        const rebootParams = upgrade
            ? { boot_command: 1, firmware_header: getFwHeader(binary) }
            : {};

        await device.acquire();

        if (!language) {
            await device.getCommands().typedCall('RebootToBootloader', 'Success', rebootParams);
        } else {
            const targetLanguage = params.language || device.features.language || 'en-EN';

            log.debug('onCallFirmwareUpdate', 'loading language blob', targetLanguage);

            const languageBlob = await getLanguage({
                language: targetLanguage,
                baseUrl: params.baseUrl!,
                version: device.firmwareRelease.release.version,
                model_internal: device.features.internal_model,
            });

            let rebootResponse = await device.getCommands().typedCall(
                'RebootToBootloader',
                // TranslationDataRequest is returned when language_data_length is sent and supported
                // Once Success is returned, device is ready to receive FirmwareErase and FirmwareUpload commands
                ['TranslationDataRequest', 'Success'],
                { ...rebootParams, language_data_length: languageBlob.byteLength },
            );

            log.debug(
                'onCallFirmwareUpdate',
                'RebootToBootloader response',
                rebootResponse.message,
            );

            while (rebootResponse.type !== 'Success') {
                const start = rebootResponse.message.data_offset;
                const end = rebootResponse.message.data_offset + rebootResponse.message.data_length;
                const chunk = languageBlob.slice(start, end);

                rebootResponse = await device.getCommands().typedCall(
                    'TranslationDataAck',
                    // TranslationDataRequest is returned when language_data_length is sent and supported
                    // Once Success is returned, device is ready to receive FirmwareErase and FirmwareUpload commands
                    ['TranslationDataRequest', 'Success'],
                    { data_chunk: Buffer.from(chunk).toString('hex') },
                );
            }
        }
        await device.release();

        // todo: link issue
        if (device.features.major_version === 1) {
            // This delay is crucial see https://github.com/trezor/trezor-firmware/issues/1983
            await createTimeoutPromise(2000);
        }

        reconnectedDevice = await waitForReconnectedDevice({
            params: {
                bootloader: true,
                manual,
                // todo: check if correct?
                confirmOnDevice: false,
            },
            context: { deviceList, device, log, postMessage },
        });
    }

    console.log('====deviceInitiallyConnectedInBootloader', deviceInitiallyConnectedInBootloader);
    if (manual && !deviceInitiallyConnectedInBootloader) {
        await waitForDisconnectedDevice({
            params: { manual },
            context: { deviceList, device, postMessage, log },
        });
    }

    if (!params.binary && device.firmwareRelease.intermediaryVersion) {
        log.debug('onCallFirmwareUpdate', 'installing intermediary');

        reconnectedDevice = await waitForReconnectedDevice({
            params: {
                bootloader: true,
                manual,
                // todo: check if correct?
                confirmOnDevice: true,
            },
            context: { deviceList, device, log, postMessage },
        });

        // note: fw major_version 1 requires calling initialize before calling FirmwareErase. Without it device would not respond
        await reconnectedDevice.initialize(false, false);

        await uploadFirmware(
            reconnectedDevice.getCommands().typedCall.bind(reconnectedDevice.getCommands()),
            postMessage,
            reconnectedDevice,
            { payload: binary },
        );

        await reconnectedDevice.release();

        await waitForDisconnectedDevice({
            params: { manual },
            context: { deviceList, log, device: reconnectedDevice, postMessage },
        });

        reconnectedDevice = await waitForReconnectedDevice({
            params: { bootloader: true, manual, confirmOnDevice: false },
            context: { deviceList, device: reconnectedDevice, log, postMessage },
        });

        binary = await getBinaryHelper(reconnectedDevice, params, log, postMessage);

        // note: fw major_version 1 requires calling initialize before calling FirmwareErase. Without it device would not respond
        await reconnectedDevice.initialize(false, false);

        await uploadFirmware(
            reconnectedDevice.getCommands().typedCall.bind(reconnectedDevice.getCommands()),
            postMessage,
            reconnectedDevice,
            { payload: stripped },
        );

        await reconnectedDevice.release();
    } else {
        reconnectedDevice = await waitForReconnectedDevice({
            params: { bootloader: true, manual, confirmOnDevice: true },
            context: { deviceList, device, log, postMessage },
        });

        // note: fw major_version 1 requires calling initialize before calling FirmwareErase. Without it device would not respond
        await reconnectedDevice.initialize(false, false);

        await uploadFirmware(
            reconnectedDevice.getCommands().typedCall.bind(reconnectedDevice.getCommands()),
            postMessage,
            reconnectedDevice,
            { payload: shouldStripFwHeaders(device.features) ? stripped : binary },
        );

        await reconnectedDevice.release();
    }

    await waitForDisconnectedDevice({
        params: { manual },
        context: { deviceList, log, device: reconnectedDevice, postMessage },
    });

    reconnectedDevice = await waitForReconnectedDevice({
        params: { bootloader: false, manual, confirmOnDevice: false },
        context: { deviceList, device: reconnectedDevice, log, postMessage },
    });

    const checkSupported = reconnectedDevice.atLeast(['1.11.1', '2.5.1']) && !params.binary;

    if (checkSupported) {
        try {
            log.debug(
                'onCallFirmwareUpdate',
                'getFirmwareHash supported, proceed with check',
                stripped,
            );

            const isValid = await firmwareCheck(reconnectedDevice, device, stripped!, postMessage);
            await reconnectedDevice.release();
            if (isValid) {
                log.debug('onCallFirmwareUpdate', 'installed fw hash and calculated hash match');

                return { check: 'valid' as const };
            } else {
                return { check: 'mismatch' as const };
            }
        } catch (err) {
            // TrezorConnect error. Only 'softly' inform user that we were not able to
            // validate firmware hash
            return { check: 'other-error' as const, checkError: err.message };
        }
    } else {
        await reconnectedDevice.release();

        return { check: 'omitted' };
    }
};
