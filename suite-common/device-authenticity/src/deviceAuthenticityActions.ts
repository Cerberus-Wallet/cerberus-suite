import { createAction } from '@reduxjs/toolkit';

import { CerberusDevice } from '@suite-common/suite-types';
import { AuthenticateDeviceResult } from '@cerberus/connect';

export const ACTION_PREFIX = '@device-authenticity';

export type StoredAuthenticateDeviceResult =
    | (Omit<Partial<AuthenticateDeviceResult>, 'error'> & {
          error?: string;
      })
    | undefined;

const result = createAction(
    `${ACTION_PREFIX}/result`,
    (payload: { device: CerberusDevice; result: StoredAuthenticateDeviceResult }) => ({
        payload,
    }),
);

export const deviceAuthenticityActions = {
    result,
} as const;
