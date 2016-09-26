#!/usr/bin/env bash
datadir="$(dirname $BASH_SOURCE)/../../data"
curl "http://calendar.utulsa.edu/api/2/places?pp=100" > "$datadir/localist.json"
