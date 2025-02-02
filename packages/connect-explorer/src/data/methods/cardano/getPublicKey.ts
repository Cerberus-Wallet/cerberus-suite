import { cardanoDerivationType } from './common';

const name = 'cardanoGetPublicKey';
const docs = 'methods/cardanoGetPublicKey.md';
const batch = [
    {
        name: 'path',
        label: 'Bip44 path',
        type: 'input',
        value: `m/44'/1815'/0'`,
    },
    {
        name: 'showOnCerberus',
        label: 'Show on Cerberus',
        type: 'checkbox',
        value: true,
    },
    cardanoDerivationType,
];

export default [
    {
        url: '/method/cardanoGetPublicKey',
        name,
        docs,
        submitButton: 'Get public key',

        fields: batch,
    },

    {
        url: '/method/cardanoGetPublicKey-multiple',
        name,
        docs,
        submitButton: 'Get multiple public keys',

        fields: [
            {
                name: 'bundle',
                type: 'array',
                batch: [
                    {
                        type: '',
                        fields: batch,
                    },
                ],
                items: [batch, batch],
            },
        ],
    },
];
