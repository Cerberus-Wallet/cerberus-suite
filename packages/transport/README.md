# @cerberus/transport

[![NPM](https://img.shields.io/npm/v/@cerberus/transport.svg)](https://www.npmjs.org/package/@cerberus/transport)

Library for low-level communication with Cerberus.

Intended as a "building block" for other packages - it is used in ~~trezor.js~~ (deprecated) and [@cerberus/connect](https://github.com/Cerberus-Wallet/cerberus-suite/tree/develop/packages/connect).

_You probably don't want to use this package directly._ For communication with Cerberus via a more high-level API, use [@cerberus/connect](https://github.com/Cerberus-Wallet/cerberus-suite/tree/develop/packages/connect).

## What is the purpose

-   translate JSON payloads to binary messages using [protobuf definitions](https://github.com/Cerberus-Wallet/cerberus-common/tree/master/protob) comprehensible to Cerberus devices
-   chunking and reading chunked messages according to the [Cerberus protocol](https://github.com/Cerberus-Wallet/cerberus-common/blob/master/protob/protocol.md)
-   exposing single API for various transport methods:
    -   Cerberus Bridge
    -   WebUSB
-   Create and expose typescript definitions based on protobuf definitions.

## From Protobuf to TypeScript ~~and Flow~~

> note: flow.js support was removed in @cerberus/connect v9 (https://github.com/Cerberus-Wallet/cerberus-suite/pull/6389)

This section describes how the definitions of protobuf messages maintained in the
firmware repo are semi-automatically translated to ~~Flow~~ and TypeScript definitions that are used in Connect codebase and by Connect users respectively.

### The short version

In order to be able to use new features of trezor-firmware you need to update protobuf definitions.

1. `git submodule update --init --recursive` to initialize cerberus-common submodule
1. `yarn update-submodules` to update cerberus-common submodule
1. `yarn update-protobuf` to generate new `./messages.json` and `./src/types/messages.ts`

### In depth explanation

The beginning and source of truth are the `.proto` definitions in the [firmware repository](https://github.com/Cerberus-Wallet/cerberus-firmware/tree/main/common/protob). These are duplicated as read-only in the [cerberus-common](https://github.com/Cerberus-Wallet/cerberus-common) repository.

`cerberus-common` is included in `trezor-suite` as a git submodule mounted at `packages/transport/cerberus-common`.`

Here, `.proto` definitions are translated to a JSON format using [pbjs](https://www.npmjs.com/package/pbjs) package. This JSON is used on runtime by the `@cerberus/transport` package
for (de)serialization logic and to generate Typescript definitions.

The JSON is transformed to TypeScript definitions by a script in `scripts/protobuf-types.js`. The script also applies 'patches' I.e. after-the-fact fixes manually described in `scripts/protobuf-patches.js`. The patches compensate for/fix

-   The source `.proto` definitions that do not reflect the actual business logic. Usually fields marked as required which are in fact optional.
-   Fields typed as `uint32`, `uint64`, `sint32`, `sint64` in protobuf that need to be represented as strings in runtime because of javascript number's insufficient range. Runtime conversion is handled automatically by `@cerberus/transport`.
-   Similarly, fields typed as `bytes` in protobuf may be represented as hexadecimal `string`, `Buffer`, `Uint8Array` or `Array<number>` in runtime.
-   Optional protobuf fields that get typed as `<T> | undefined` but are in fact deserialized as `<T> | null`. This could be handled globally by `@cerberus/transport`. The patches exist mainly for historical reasons.

All these steps are done manually and all the generated files are tracked in git. It's also not uncommon to circumvent
some step by e.g. generating the messages.json file not from the Common submodule but directly from the firmware repo.

## Publishing

This package is published to npm registry because it is a dependency of [@cerberus/connect](https://github.com/Cerberus-Wallet/cerberus-suite/issues/5440) which can be installed as a standalone package.

[Follow instructions](../../docs/releases/npm-packages.md) how to publish @cerberus package to npm registry.
