#!/usr/bin/env bash

if ! head -n1 "$1" | grep -Eq '^[^:[:space:]]+: .+'; then
    echo "error: commit message must be formatted as '<scope>: <description>'."
    echo "       see https://scopedcommits.com"
    exit 1
fi
