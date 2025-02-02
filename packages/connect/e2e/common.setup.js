import CerberusConnect from '../src';
import { versionUtils } from '@cerberus/utils';
import { UI } from '../src/events';
import { toHardened, getHDPath } from '../src/utils/pathUtils';
import { CerberusUserEnvLink } from '@cerberus/cerberus-user-env-link';

const MNEMONICS = {
    mnemonic_all: 'all all all all all all all all all all all all',
    mnemonic_12: 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle',
    mnemonic_abandon:
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
};

const emulatorStartOpts = process.env.emulatorStartOpts || global.emulatorStartOpts;
const firmware = emulatorStartOpts.version;

const getController = name => {
    CerberusUserEnvLink.on('error', error => {
        console.error('CerberusUserEnvLink WS error', error);
    });
    CerberusUserEnvLink.on('disconnect', () => {
        console.error('CerberusUserEnvLink WS disconnected');
    });

    CerberusUserEnvLink.state = {};

    return CerberusUserEnvLink;
};

const setup = async (CerberusUserEnvLink, options) => {
    const { state } = CerberusUserEnvLink;

    await CerberusUserEnvLink.connect();

    if (
        state.mnemonic === options.mnemonic &&
        state.passphrase_protection === options.passphrase_protection &&
        JSON.stringify(state.settings) === JSON.stringify(options.settings) &&
        !options.settings?.auto_lock_delay_ms // if device lock itself between test cases test will end timeout. user-env changes required (pin_sequence) https://github.com/Cerberus-Wallet/cerberus-user-env/pull/205
    ) {
        return true;
    }

    if (!options.mnemonic) return true; // skip setup if test is not using the device (composeTransaction)

    await CerberusUserEnvLink.api.stopEmu();

    // after bridge is stopped, cerberus-user-env automatically resolves to use udp transport.
    // this is actually good as we avoid possible race conditions when setting up emulator for
    // the test using the same transport
    await CerberusUserEnvLink.api.stopBridge();

    await CerberusUserEnvLink.api.startEmu(emulatorStartOpts);

    const mnemonic =
        typeof options.mnemonic === 'string' && options.mnemonic.indexOf(' ') > 0
            ? options.mnemonic
            : MNEMONICS[options.mnemonic];

    await CerberusUserEnvLink.api.setupEmu({
        mnemonic,
        pin: options.pin || '',
        passphrase_protection: !!options.passphrase_protection,
        label: options.label || 'CerberusT',
        needs_backup: false,
        options,
    });

    if (options.settings) {
        // allow apply-settings to fail, older FW may not know some flags yet
        try {
            await CerberusUserEnvLink.send({ type: 'emulator-apply-settings', ...options.settings });
        } catch (e) {
            console.warn('Setup apply settings failed', options.settings, e.message);
        }
    }

    CerberusUserEnvLink.state = options;

    // after all is done, start bridge again
    await CerberusUserEnvLink.api.startBridge();
};

const initCerberusConnect = async (CerberusUserEnvLink, options) => {
    CerberusConnect.removeAllListeners();

    CerberusConnect.on('device-connect', device => {
        const { major_version, minor_version, patch_version, internal_model, revision } =
            device.features;
        // eslint-disable-next-line no-console
        console.log('Device connected: ', {
            major_version,
            minor_version,
            patch_version,
            internal_model,
            revision,
        });
    });

    CerberusConnect.on(UI.REQUEST_CONFIRMATION, () => {
        CerberusConnect.uiResponse({
            type: UI.RECEIVE_CONFIRMATION,
            payload: true,
        });
    });

    CerberusConnect.on(UI.REQUEST_BUTTON, () => {
        setTimeout(() => CerberusUserEnvLink.send({ type: 'emulator-press-yes' }), 1);
    });

    await CerberusConnect.init({
        manifest: {
            appUrl: 'tests.connect.cerberus.uraanai.com',
            email: 'tests@connect.cerberus.uraanai.com',
        },
        transports: ['BridgeTransport'],
        debug: false,
        popup: false,
        pendingTransportEvent: true,
        connectSrc: process.env.CERBERUS_CONNECT_SRC, // custom source for karma tests
        ...options,
    });
};

// skipping tests rules:
// "1" | "2" - global skip for model
// ">1.9.3" - skip for FW greater than 1.9.3
// "<1.9.3" - skip for FW lower than 1.9.3
// "1.9.3" - skip for FW exact with 1.9.3
// "1.9.3-1.9.6" - skip for FW gte 1.9.3 && lte 1.9.6
const skipTest = rules => {
    if (!rules || !Array.isArray(rules)) return;
    const fwModel = firmware.substring(0, 1);
    const fwMaster = firmware.includes('-main');
    const rule = rules
        .filter(skip => skip.substring(0, 1) === fwModel || skip.substring(1, 2) === fwModel) // filter rules only for current model
        .find(skip => {
            if (!skip.search('.') && skip === fwModel) {
                // global model
                return true;
            }

            // is within range
            const [from, to] = skip.split('-');
            if (
                !fwMaster &&
                from &&
                to &&
                versionUtils.isNewerOrEqual(firmware, from) &&
                !versionUtils.isNewer(firmware, to)
            ) {
                return true;
            }

            if (
                !fwMaster &&
                skip.startsWith('<') &&
                !versionUtils.isNewerOrEqual(firmware, skip.substring(1))
            ) {
                // lower
                return true;
            }
            if (
                (fwMaster && skip.startsWith('>')) ||
                (!fwMaster &&
                    skip.startsWith('>') &&
                    versionUtils.isNewer(firmware, skip.substring(1)))
            ) {
                // greater
                return true;
            }
            if (!fwMaster && versionUtils.isEqual(firmware, skip)) {
                // exact
                return true;
            }

            return false;
        });

    return rule;
};

const conditionalTest = (rules, ...args) => {
    const skipMethod = typeof jest !== 'undefined' ? it.skip : xit;
    const testMethod = skipTest(rules) ? skipMethod : it;

    return testMethod(...args);
};

global.Cerberus = {
    getController,
    setup,
    skipTest,
    conditionalTest,
    initCerberusConnect,
};

const ADDRESS_N = getHDPath;

global.TestUtils = {
    ...global.TestUtils,
    ADDRESS_N,
};
