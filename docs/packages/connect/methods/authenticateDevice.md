## authenticateDevice

> :note: **Supported only by T2B1 devices**

Request a signature and validate certificate issued by the Cerberus company.
Returns [DeviceAuthenticityResult type](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/api/authenticateDevice.ts)

### Params

[Optional common params](commonParams.md)

-   `config` — _optional_ [`DeviceAuthenticityConfig`](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/api/authenticateDevice.ts)

### Example

```javascript
TrezorConnect.authenticateDevice({ config });
```

### Result

```javascript
{
    success: true,
    payload: DeviceAuthenticityResult
}
```
