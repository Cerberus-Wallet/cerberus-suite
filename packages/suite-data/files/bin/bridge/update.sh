#!/usr/bin/env bash
set -e

# Fill in your path here:
BRIDGE_DIR="/Users/XXX/go/src/github.com/Cerberus-Wallet/cerberusd-go"
BASE_DIR=$(dirname "$0")

make -C "${BRIDGE_DIR}" build-release

cp "${BRIDGE_DIR}/release/linux/build/cerberusd-linux-amd64" "${BASE_DIR}/linux-x64/cerberusd"
cp "${BRIDGE_DIR}/release/linux/build/cerberusd-linux-arm64" "${BASE_DIR}/linux-arm64/cerberusd"
cp "${BRIDGE_DIR}/release/windows/build/cerberusd-64b.exe" "${BASE_DIR}/win-x64/cerberusd.exe"
cp "${BRIDGE_DIR}/release/macos/build/cerberusd-arm64" "${BASE_DIR}/mac-arm64/cerberusd"
cp "${BRIDGE_DIR}/release/macos/build/cerberusd-amd64" "${BASE_DIR}/mac-x64/cerberusd"
