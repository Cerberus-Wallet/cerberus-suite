## Init

Initiate CerberusConnect

```javascript
const result = await CerberusConnect.init(params);
```

### Params

[init type](https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/api/init.ts)

-   `manifest` - _required_ `Object` of type `[Manifest]`(https://github.com/Cerberus-Wallet/cerberus-suite/blob/develop/packages/connect/src/types/settings.ts#L3),
-   `connectSrc` - _optional_ `string`. Set custom src for CerberusConnect iframe.
-   `debug` - _optional_ `boolean`, default `false`. Prints debug logs.
-   `transportReconnect` - _optional_ `boolean`, default `true`. If transport dies during lifecycle of application, this field decides whether CerberusConnect tries to reestablish connection with transport layer.
-   `pendingTransportEvent` - _optional_ `boolean`, default `true`. Postpone emitting TRANSPORT.START event to the moment when connected device becomes available.
-   `interactionTimeout` - _optional_ `number`, default `600`. Time in seconds after which popup automatically closes.
-   `lazyLoad` - _optional_ `boolean`, default `false`. Postpone iframe creation until CerberusConnect is called for the first time.
-   `popup` - _optional_ `boolean`, default `true`. Projects running on trusted domains (cerberus.uraanai.com) are not required to use popup. For other domains this option is ignored.
-   `transports` — \_optional `'(BridgeTransport' | 'WebUsbTransport | 'NodeUsbTransport')[]'`, Array of transports that should be use. If not provided, CerberusConnect will chose a reasonable
    default based on your environment.
-   `webusb` — _deprecated_ `boolean`, default `true`. Allow webusb. Deprecated, you should use `transports` instead.

### Result

CerberusConnect.init returns `Promise<void>`
