#!/bin/sh
# re-indent and sort manifest.json
# depends on jq https://stedolan.github.io/jq/
set -euf
jq --monochrome-output --sort-keys --ascii-output . manifest.json > .clean_manifest.json
mv .clean_manifest.json manifest.json
