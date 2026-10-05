#!/usr/bin/env bash

if ! grep -q '^Signed-off-by: ' "$1"; then
    echo "error: commit message is missing a Signed-off-by trailer."
    echo "       use 'git commit -s' to add one."
    exit 1
fi
