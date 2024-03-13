# Methods

API call return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Resolve is guaranteed to get called
with a `result` object, even if user closes the window, network connection times
out, etc. In case of failure `result.success` is set to false and `result.payload.error` is
the error message. It is recommended to log the error message and let user
restart the action.

Every method require an [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) with combination of [`common`](methods/commonParams.md) fields and method specific fields.

-   [CerberusConnect.getPublicKey](methods/getPublicKey.md)
-   [CerberusConnect.requestLogin](methods/requestLogin.md)
-   [CerberusConnect.cipherKeyValue](methods/cipherKeyValue.md)
-   [CerberusConnect.wipeDevice](methods/wipeDevice.md)
-   [CerberusConnect.resetDevice](methods/resetDevice.md)
-   [CerberusConnect.getCoinInfo](methods/getCoinInfo.md)
-   [CerberusConnect.getDeviceState](methods/getDeviceState.md)

## Bitcoin, Bitcoin Cash, Bitcoin Gold, Litecoin, Dash, ZCash, Testnet

-   [CerberusConnect.getAddress](methods/getAddress.md)
-   [CerberusConnect.getAccountInfo](methods/getAccountInfo.md)
-   [CerberusConnect.getOwnershipId](methods/getOwnershipId.md)
-   [CerberusConnect.getOwnershipProof](methods/getOwnershipProof.md)
-   [CerberusConnect.composeTransaction](methods/composeTransaction.md)
-   [CerberusConnect.signTransaction](methods/signTransaction.md)
-   [CerberusConnect.pushTransaction](methods/pushTransaction.md)
-   [CerberusConnect.signMessage](methods/signMessage.md)
-   [CerberusConnect.verifyMessage](methods/verifyMessage.md)
-   [CerberusConnect.authorizeCoinjoin](methods/authorizeCoinjoin.md)

## Ethereum

-   [CerberusConnect.ethereumGetAddress](methods/ethereumGetAddress.md)
-   [CerberusConnect.ethereumSignTransaction](methods/ethereumSignTransaction.md)
-   [CerberusConnect.ethereumSignMessage](methods/ethereumSignMessage.md)
-   [CerberusConnect.ethereumSignTypedData](methods/ethereumSignTypedData.md)
-   [CerberusConnect.ethereumVerifyMessage](methods/ethereumVerifyMessage.md)

## Eos

-   [CerberusConnect.eosGetPublicKey](methods/eosGetPublicKey.md)
-   [CerberusConnect.eosSignTransaction](methods/eosSignTransaction.md)

## NEM

-   [CerberusConnect.nemGetAddress](methods/nemGetAddress.md)
-   [CerberusConnect.nemSignTransaction](methods/nemSignTransaction.md)

## Stellar

-   [CerberusConnect.stellarGetAddress](methods/stellarGetAddress.md)
-   [CerberusConnect.stellarSignTransaction](methods/stellarSignTransaction.md)

## Cardano

-   [CerberusConnect.cardanoGetPublicKey](methods/cardanoGetPublicKey.md)
-   [CerberusConnect.cardanoGetAddress](methods/cardanoGetAddress.md)
-   [CerberusConnect.cardanoSignTransaction](methods/cardanoSignTransaction.md)

## Ripple

-   [CerberusConnect.rippleGetAddress](methods/rippleGetAddress.md)
-   [CerberusConnect.rippleSignTransaction](methods/rippleSignTransaction.md)

## Solana

-   [CerberusConnect.solanaGetPublicKey](methods/solanaGetPublicKey.md)
-   [CerberusConnect.solanaGetAddress](methods/solanaGetAddress.md)
-   [CerberusConnect.solanaSignTransaction](methods/solanaSignTransaction.md)

## Tezos

-   [CerberusConnect.tezosGetAddress](methods/tezosGetAddress.md)
-   [CerberusConnect.tezosGetPublicKey](methods/tezosGetPublicKey.md)
-   [CerberusConnect.tezosSignTransaction](methods/tezosSignTransaction.md)

## Binance

-   [CerberusConnect.binanceGetAddress](methods/binanceGetAddress.md)
-   [CerberusConnect.binanceGetPublicKey](methods/binanceGetPublicKey.md)
-   [CerberusConnect.binanceSignTransaction](methods/binanceSignTransaction.md)

## Management

> please note that these method are not available from popup mode

-   [CerberusConnect.firmwareUpdate](methods/firmwareUpdate.md)
-   [CerberusConnect.getFirmwareHash](methods/getFirmwareHash.md)
-   [CerberusConnect.changePin](methods/changePin.md)
-   [CerberusConnect.changeWipeCode](methods/changeWipeCode.md)
