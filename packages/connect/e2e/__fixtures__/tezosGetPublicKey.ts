const legacyResults = [
    {
        // Tezos not supported below this version
        rules: ['<2.0.8', '1'],
        success: false,
    },
];

export default {
    method: 'tezosGetPublicKey',
    setup: {
        mnemonic: 'mnemonic_12',
    },
    tests: [
        {
            description: "m/44'/1729'/0'",
            params: {
                path: "m/44'/1729'/0'",
                showOnCerberus: false,
            },
            result: {
                publicKey: 'edpkuxZ5W8c2jmcaGuCFZxRDSWxS7hp98zcwj2YpUZkJWs5F7UMuF6',
            },
        },
        {
            description: "m/44'/1729'/1'",
            params: {
                path: "m/44'/1729'/1'",
                showOnCerberus: false,
            },
            result: {
                publicKey: 'edpkuVKVFyqTnp4axajmxTnCcSHN7v1kRhVpBC25GEZQVT2ZzSpdJY',
            },
        },
        {
            description: "m/44'/1729'",
            params: {
                path: "m/44'/1729'",
                showOnCerberus: false,
            },
            result: false,
        },
        {
            description: "m/44'/1729'/0",
            params: {
                path: "m/44'/1729'/0",
                showOnCerberus: false,
            },
            result: false,
        },
    ].map(fixture => ({ ...fixture, legacyResults })),
};
