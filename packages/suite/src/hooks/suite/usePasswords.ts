import { useState } from 'react';
import crypto from 'crypto';

import TrezorConnect from '@trezor/connect';
import { selectDevice } from '@suite-common/wallet-core';

import { useSelector, useDispatch } from 'src/hooks/suite';
import * as metadataProviderActions from 'src/actions/suite/metadataProviderActions';
import * as metadataPasswordsActions from 'src/actions/suite/metadataPasswordsActions';
import { METADATA_PROVIDER, METADATA_PASSWORDS } from 'src/actions/suite/constants';
import type { PasswordEntry, PasswordManagerState } from 'src/types/suite/metadata';
import {
    selectPasswordManagerState,
    selectSelectedProviderForPasswords,
} from 'src/reducers/suite/metadataReducer';

export const usePasswords = () => {
    // todo: filename is saved only locally. for production grade state of this feature we will of course need to save it into app state.

    const [fileName, setFileName] = useState('');
    const [providerConnecting, setProviderConnecting] = useState(false);
    const [fetchingPasswords, setFetchingPasswords] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({});
    const [encryptionKey, setEncryptionKey] = useState<string>('');

    const device = useSelector(selectDevice);
    const selectedProvider = useSelector(selectSelectedProviderForPasswords);
    const dispatch = useDispatch();

    const { entries, tags, extVersion } =
        useSelector(state => selectPasswordManagerState(state, fileName)) ||
        METADATA_PASSWORDS.DEFAULT_PASSWORD_MANAGER_STATE;

    const connect = () => {
        setFileName('');
        setProviderConnecting(true);
        TrezorConnect.cipherKeyValue({
            device: { path: device?.path },
            override: true,
            useEmptyPassphrase: true,
            path: METADATA_PASSWORDS.PATH,
            key: METADATA_PASSWORDS.DEFAULT_KEYPHRASE,
            value: METADATA_PASSWORDS.DEFAULT_NONCE,
            encrypt: true,
            askOnEncrypt: true,
            askOnDecrypt: true,
        })
            .then(async res => {
                if (!res.success) {
                    throw new Error(res.payload.error);
                }
                const encryptionKey = Buffer.from(
                    res.payload.value.substring(
                        res.payload.value.length / 2,
                        res.payload.value.length,
                    ),
                    'hex',
                );
                setEncryptionKey(encryptionKey);

                const fileKey = res.payload.value.substring(0, res.payload.value.length / 2);
                const fname = `${crypto
                    .createHmac('sha256', fileKey)
                    .update(METADATA_PASSWORDS.FILENAME_MESS)
                    .digest('hex')}.pswd`;

                setFileName(fname);

                if (!selectedProvider) {
                    await dispatch(
                        metadataProviderActions.connectProvider({
                            type: 'dropbox',
                            dataType: 'passwords',
                            clientId: METADATA_PROVIDER.DROPBOX_PASSWORDS_CLIENT_ID,
                        }),
                    );
                }

                setFetchingPasswords(true);
                await dispatch(metadataPasswordsActions.fetchPasswords(fname, encryptionKey));
                setFetchingPasswords(false);
            })
            .finally(() => {
                setProviderConnecting(false);
                setFetchingPasswords(false);
            });
    };

    const disconnect = () => {
        if (!selectedProvider) return;
        dispatch(
            metadataProviderActions.disconnectProvider({
                clientId: selectedProvider.clientId,
                dataType: 'passwords',
                removeMetadata: false,
            }),
        );
    };
    const savePasswords = (nextId: number, passwordEntry: PasswordEntry) => {
        console.log('save passwords 2', passwordEntry, fileName, encryptionKey);
        dispatch(
            metadataPasswordsActions.addPasswordMetadata(
                nextId,
                passwordEntry,
                fileName,
                encryptionKey,
            ),
        );
    };

    const entriesByTag = Object.values(entries).filter(value =>
        value.tags.some(tag => selectedTags[tag]),
    );

    const isSomeTagSelected = Object.values(selectedTags).some(v => v);
    const isAllTagSelected = selectedTags['0'];

    console.log('entries', entries);
    console.log('isSomeTagSelected', isSomeTagSelected);
    console.log('isAllTagSelected', isAllTagSelected);
    console.log('tags', tags);
    return {
        entries,
        entriesByTag,
        tags,
        isSomeTagSelected,
        isAllTagSelected,
        extVersion,
        fileName,
        fetchingPasswords,
        selectedTags,
        setSelectedTags,
        connect,
        disconnect,
        device,
        selectedProvider,
        providerConnecting,
        savePasswords,
    };
};
