# Supported coins

## The pipeline

Do not change `@cerberus/connect-common/files/coins.json` manually.

The one and only source of truth are `*.json` definitions declared and maintained in the [firmware repository](https://github.com/Cerberus-Wallet/cerberus-firmware/tree/main/common/defs).

These are exported to a read-only [cerberus-common](https://github.com/Cerberus-Wallet/cerberus-common) repository.

`cerberus-common` is included as git submodule mounted at `submodules/cerberus-common`.

## Update and maintenance in @cerberus/connect

_Make sure that desired `[coin].json` definition is present in `cerberus-firmware` repository *and* corresponding [support for connect](https://github.com/Cerberus-Wallet/cerberus-firmware/blob/4e005de02fbb9db11a304587ec1abe8aab80cdfd/common/defs/support.json#L3) is enabled._

1. Update `cerberus-common` submodule:

```
 yarn update-submodules
```

2. Build `src/data/coins.json` file using `cerberus-common/cointool`:

```
yarn update-coins
```
