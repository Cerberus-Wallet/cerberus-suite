#!/usr/bin/env bash

# validate that installing connect package using npm works

set -e

trap "cd .. && rm -rf connect-implementation" EXIT

npm --version
node --version

mkdir connect-implementation
cd connect-implementation
npm init -y
npm install tslib --save # peer dependency
npm install @cerberus/connect --save
npm install @cerberus/connect-web --save

cat package.json

echo "const CerberusConnect = require('@cerberus/connect')" > ./index.js
node index.js

