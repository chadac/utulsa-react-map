#!/usr/bin/env bash
datadir="$(dirname $BASH_SOURCE)/../../data"
cat "$datadir/places.csv" | csvtojson > "$datadir/prod.json"
