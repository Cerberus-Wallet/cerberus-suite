export const HAS_EMAIL_FLAG = 'hasEmail';
export const HAS_BOOKMARK_FLAG = 'hasBookmark';

type AnyFlag = typeof HAS_EMAIL_FLAG | typeof HAS_BOOKMARK_FLAG;

export enum Flags {
    None = 0,
    hasEmail = 1 << 0,
    hasBookmark = 1 << 1,
    // add more flags here e.g:
    // hasFlag = 1 << 2,
}

export const isFlagPresent = (flag: AnyFlag, cerberusSavedNumber: number) =>
    (cerberusSavedNumber & Flags[flag]) === Flags[flag];

export const addToFlags = (flag: AnyFlag, cerberusSavedNumber: number) =>
    cerberusSavedNumber | Flags[flag];

// note that cerberus does not allow to remove flag, so we do not implement "removeFromFlags" method
