# Models

## The pipeline

Do not change `@cerberus/connect/src/data/models.ts` manually.

The one and only source of truth is `models.json` definition declared and maintained in the [firmware repository](https://github.com/Cerberus-Wallet/cerberus-firmware/tree/main/common).

These are exported to a read-only [cerberus-common](https://github.com/Cerberus-Wallet/cerberus-common) repository.

`cerberus-common` is included as git submodule mounted at `submodules/cerberus-common`.

## Update and maintenance in @cerberus/connect

1. Update `cerberus-common` submodule:

```
 yarn update-submodules
```

2. Copy `models.json` to `trezor/connect/src/data/models.ts`:

```
yarn update-models
```
