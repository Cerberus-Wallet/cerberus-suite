const name = 'solanaGetAddress';
const docs = 'methods/solanaGetAddress.md';

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

const chunkify = {
    name: 'chunkify',
    label: 'Display address in chunks of 4 characters',
    type: 'checkbox',
    value: false,
};

const batch = [getAddress, showOnCerberus, chunkify];

export default [
    {
        url: '/method/solanaGetAddress',
        name,
        docs,
        submitButton: 'Get address',
        fields: batch,
    },
];
