import { PopupHandshake, PopupMethodInfo, IFrameLoaded } from '@cerberus/connect';
import type { Core } from '@cerberus/connect/lib/core';
import type { OriginBoundState } from '@cerberus/connect-common';

export type State = Partial<PopupHandshake['payload']> &
    Partial<PopupMethodInfo['payload']> &
    Partial<IFrameLoaded['payload']> & {
        iframe?: Window;
        broadcast?: BroadcastChannel;
        core?: Core;
    } & Partial<OriginBoundState>;

export const getDefaultState = (): State => ({
    permissions: [],
});
