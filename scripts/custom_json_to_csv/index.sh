#!/usr/bin/env bash
datadir="$(dirname $BASH_SOURCE)/../../data"
json2csv -F -i "$datadir/custom.json" > "$datadir/places.csv"
