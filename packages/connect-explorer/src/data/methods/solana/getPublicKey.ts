const name = 'solanaGetPublicKey';
const docs = 'methods/solanaGetPublicKey.md';

const getAddress = {
    name: 'path',
    label: 'Bip44 path',
    type: 'input',
    value: `m/44'/501'/0'/0'`,
};

const showOnCerberus = {
    name: 'showOnCerberus',
    label: 'Show on Cerberus',
    type: 'checkbox',
    value: true,
};

const batch = [getAddress, showOnCerberus];

export default [
    {
        url: '/method/solanaGetPublicKey',
        name,
        docs,
        submitButton: 'Get public key',
        fields: batch,
    },
    {
        url: '/method/solanaGetPublicKey-multiple',
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
