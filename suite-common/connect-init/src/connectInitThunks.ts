import { createThunk } from '@suite-common/redux-utils';
import CerberusConnect, {
    BLOCKCHAIN_EVENT,
    DEVICE_EVENT,
    TRANSPORT_EVENT,
    UI_EVENT,
} from '@cerberus/connect';
import { getSynchronize } from '@cerberus/utils';

import { cardanoConnectPatch } from './cardanoConnectPatch';

const actionsPrefix = '@common/connect-init';

// If you are looking where connectInitSettings is defined, it is defined in packages/suite/src/support/extraDependencies.ts
// or in suite-native/state/src/extraDependencies.ts depends on which platform this connectInitThunk runs.

export const connectInitThunk = createThunk(
    `${actionsPrefix}/initThunk`,
    async (_, { dispatch, getState, extra }) => {
        const {
            selectors: {
                selectEnabledNetworks,
                selectIsPendingTransportEvent,
                selectDebugSettings,
            },
            actions: { lockDevice },
            utils: { connectInitSettings },
        } = extra;

        const getEnabledNetworks = () => selectEnabledNetworks(getState());

        // set event listeners and dispatch as
        CerberusConnect.on(DEVICE_EVENT, ({ event: _, ...action }) => {
            // dispatch event as action
            dispatch(action);
        });

        CerberusConnect.on(UI_EVENT, ({ event: _, ...action }) => {
            // dispatch event as action
            dispatch(action);
        });

        CerberusConnect.on(TRANSPORT_EVENT, ({ event: _, ...action }) => {
            // dispatch event as action
            dispatch(action);
        });

        CerberusConnect.on(BLOCKCHAIN_EVENT, ({ event: _, ...action }) => {
            // dispatch event as action
            dispatch(action);
        });

        const synchronize = getSynchronize();

        const wrappedMethods: Array<keyof typeof CerberusConnect> = [
            'applySettings',
            'authenticateDevice',
            'authorizeCoinjoin',
            'backupDevice',
            'cancelCoinjoinAuthorization',
            'cardanoGetAddress',
            'cardanoGetPublicKey',
            'cardanoSignTransaction',
            'changePin',
            'checkFirmwareAuthenticity',
            'cipherKeyValue',
            'ethereumGetAddress',
            'ethereumSignTransaction',
            'getAddress',
            'getDeviceState',
            'getFeatures',
            'getOwnershipProof',
            'getPublicKey',
            'pushTransaction',
            'rebootToBootloader',
            'recoveryDevice',
            'resetDevice',
            'rippleGetAddress',
            'rippleSignTransaction',
            'setBusy',
            'showDeviceTutorial',
            'signTransaction',
            'solanaGetAddress',
            'solanaSignTransaction',
            'unlockPath',
            'wipeDevice',
        ] as const;

        wrappedMethods.forEach(key => {
            // typescript complains about params and return type, need to be "any"
            const original: any = CerberusConnect[key];
            if (!original) return;
            (CerberusConnect[key] as any) = async (params: any) => {
                dispatch(lockDevice(true));
                const result = await synchronize(() => original(params));
                dispatch(lockDevice(false));

                return result;
            };
        });

        cardanoConnectPatch(getEnabledNetworks);

        try {
            await CerberusConnect.init({
                ...connectInitSettings,
                pendingTransportEvent: selectIsPendingTransportEvent(getState()),
                transports: selectDebugSettings(getState()).transports,
                // debug: true, // Enable debug logs in CerberusConnect
            });
        } catch (error) {
            let formattedError: string;
            if (typeof error === 'string') {
                formattedError = error;
            } else {
                formattedError = error.code ? `${error.code}: ${error.message}` : error.message;
            }
            throw new Error(formattedError);
        }
    },
);
