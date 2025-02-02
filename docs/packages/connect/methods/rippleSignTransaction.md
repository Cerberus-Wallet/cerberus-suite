## Ripple: Sign transaction

Asks device to sign given transaction. User is asked to confirm all transaction
details on Cerberus.

```javascript
const result = await CerberusConnect.rippleSignTransaction(params);
```

### Params

[Optional common params](commonParams.md)

[RippleSignTransaction type](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/api/ripple/index.ts)

-   `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
-   `transaction` - _required_ `Object` type of [RippleTransaction](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/api/ripple/index.ts)
-   `chunkify` — _optional_ `boolean` determines if recipient address will be displayed in chunks of 4 characters. Default is set to `false`

### Example

```javascript
CerberusConnect.rippleSignTransaction(
    path: "m/44'/144'/0'/0/0",
    transaction: {
        fee: '100000',
        flags: 0x80000000,
        sequence: 25,
        payment: {
            amount: '100000000',
            destination: 'rBKz5MC2iXdoS3XgnNSYmF69K1Yo4NS3Ws'
        }
    }
});
```

### Result

[RippleSignedTx type](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/api/ripple/index.ts)

```javascript
{
    success: true,
    payload: {
        serializedTx: string,
        signature: string,
    }
}
```

Error

```javascript
{
    success: false,
    payload: {
        error: string // error message
    }
}
```
