const name = 'tezosGetPublicKey';
const docs = 'methods/tezosGetPublicKey.md';
const batch = [
    {
        name: 'path',
        label: 'Bip44 path',
        type: 'input',
        value: `m/44'/1729'/0'`,
    },
    {
        name: 'showOnCerberus',
        label: 'Show on Cerberus',
        type: 'checkbox',
        value: true,
    },
    {
        name: 'chunkify',
        label: 'Display address in chunks of 4 characters',
        type: 'checkbox',
        value: false,
    },
];

export default [
    {
        url: '/method/tezosGetPublicKey',
        name,
        docs,
        submitButton: 'Get public key',

        fields: batch,
    },

    {
        url: '/method/tezosGetPublicKey-multiple',
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
