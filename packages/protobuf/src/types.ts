import * as Messages from './messages';

export type MessageFromCerberus = {
    type: keyof Messages.MessageType;
    message: Record<string, unknown>;
};
