#!/usr/bin/env bash

set -euxo pipefail

# Log the current working directory
echo "Current working directory: $(pwd)"

echo "Replacing _next with next..."

# Ensure the build-webextension directory exists
mkdir -p ./build-webextension

# Correctly copy the build directory contents into build-webextension
cp -R ./build/* ./build-webextension/

# Check if manifest.json exists before copying
if [[ -f "./src-webextension/manifest.json" ]]; then
    cp ./src-webextension/manifest.json ./build-webextension/
else
    echo "manifest.json does not exist in the expected directory."
    echo "Current working directory: $(pwd)"
    exit 1
fi

# Check if _next exists before trying to move it
if [[ -d "./build-webextension/_next" ]]; then
    mv ./build-webextension/_next ./build-webextension/next
    # Replace all occurrences of /_next with /next in all files within build-webextension
    grep -rl '/_next' ./build-webextension/* | xargs sed -i 's|/_next|/next|g'
else
    echo "_next directory does not exist, skipping rename."
fi

# TODO:

# Use index.html from webextension popup.
# chrome-extension://cpopafpcfkmmfmgjmaapaaocenadbbic/index.html