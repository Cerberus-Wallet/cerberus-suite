import CerberusConnect, { CommonParams } from '@cerberus/connect';
import { analytics, EventType } from '@cerberus/suite-analytics';
import { notificationsActions } from '@suite-common/toast-notifications';
import { selectDevice } from '@suite-common/wallet-core';

import { BACKUP } from 'src/actions/backup/constants';
import type { Dispatch, GetState } from 'src/types/suite';

export type ConfirmKey =
    | 'has-enough-time'
    | 'is-in-private'
    | 'understands-what-seed-is'
    | 'wrote-seed-properly'
    | 'made-no-digital-copy'
    | 'will-hide-seed';

export type BackupStatus = 'initial' | 'in-progress' | 'finished' | 'error';
export type BackupAction =
    | { type: typeof BACKUP.RESET_REDUCER }
    | { type: typeof BACKUP.TOGGLE_CHECKBOX_BY_KEY; payload: ConfirmKey }
    | { type: typeof BACKUP.SET_STATUS; payload: BackupStatus }
    | { type: typeof BACKUP.SET_ERROR; payload: string };

export const toggleCheckboxByKey = (key: ConfirmKey): BackupAction => ({
    type: BACKUP.TOGGLE_CHECKBOX_BY_KEY,
    payload: key,
});

export const setStatus = (status: BackupStatus): BackupAction => ({
    type: BACKUP.SET_STATUS,
    payload: status,
});

export const setError = (error: string): BackupAction => ({
    type: BACKUP.SET_ERROR,
    payload: error,
});

export const resetReducer = (): BackupAction => ({
    type: BACKUP.RESET_REDUCER,
});

export const backupDevice =
    (params: CommonParams = {}, skipSuccessToast?: boolean) =>
    async (dispatch: Dispatch, getState: GetState) => {
        const device = selectDevice(getState());
        if (!device) {
            return dispatch(
                notificationsActions.addToast({
                    type: 'error',
                    error: 'Device not connected',
                }),
            );
        }

        dispatch({
            type: BACKUP.SET_STATUS,
            payload: 'in-progress',
        });

        const result = await CerberusConnect.backupDevice({
            ...params,
            device: {
                path: device.path,
            },
        });
        if (!result.success) {
            dispatch(notificationsActions.addToast({ type: 'backup-failed' }));
            dispatch({
                type: BACKUP.SET_ERROR,
                payload: result.payload.error,
            });
            analytics.report({
                type: EventType.CreateBackup,
                payload: {
                    status: 'error',
                    error: result.payload.error,
                },
            });
        } else {
            if (!skipSuccessToast) {
                dispatch(notificationsActions.addToast({ type: 'backup-success' }));
            }
            dispatch({
                type: BACKUP.SET_STATUS,
                payload: 'finished',
            });
            analytics.report({
                type: EventType.CreateBackup,
                payload: {
                    status: 'finished',
                    error: '',
                },
            });
        }
    };
