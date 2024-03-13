# Electron renderer process with assets

`@cerberus/connect` files are hosted inside application filesystem and rendered inside `iframe` element.

This application can be also developed in browser since it doesn't require any electron specific behavior.

However publishing as website will not work since `trezord` will ignore HttpRequests sent from websites other than `localhost` or `cerberus.uraanai.com`

## Install

`yarn`

## Build @cerberus/connect files

This will compile @cerberus/connect into `./assets/trezor-connect` directory

`yarn build:connect`

## Develop

`yarn dev`

## Build

`yarn build:mac`

`yarn build:linux`

`yarn build:win`
