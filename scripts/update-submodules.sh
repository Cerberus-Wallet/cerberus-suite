#!/usr/bin/env bash

set -euxo pipefail

PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$PARENT_PATH"
cd ../submodules/cerberus-common
commit=$(git rev-parse --short HEAD)
echo "$commit"
git pull origin master
cd ../
git add .
git commit -m "chore: update cerberus-common ($commit)"
git submodule update --init --recursive
