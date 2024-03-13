# @cerberus/connect-plugin-ethereum

[![Build Status](https://github.com/Cerberus-Wallet/cerberus-suite/actions/workflows/connect-test.yml/badge.svg)](https://github.com/Cerberus-Wallet/cerberus-suite/actions/workflows/connect-test.yml)
[![NPM](https://img.shields.io/npm/v/@cerberus/connect-plugin-ethereum.svg)](https://www.npmjs.org/package/@cerberus/connect-plugin-ethereum)
[![Known Vulnerabilities](https://snyk.io/test/github/cerberus/connect-plugin-ethereum/badge.svg?targetFile=package.json)](https://snyk.io/test/github/cerberus/cerberus-suite?targetFile=packages/connect-plugin-ethereum/package.json)

T1B1 firmware currently does not support constructing [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
hashes. However, it supports signing pre-constructed hashes.

EIP-712 hashes can be constructed with the plugin function
[transformTypedData](./index.js)

You may also wish to construct your own hashes using a different library.

For more information refer to [docs/ethereumSignTypedData](../../docs/packages/connect/methods/ethereumSignTypedData.md)

## Publishing

[Follow instructions](../../docs/releases/npm-packages.md) how to publish @cerberus package to npm registry.
