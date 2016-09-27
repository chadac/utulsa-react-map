#!/usr/bin/env bash
datadir="$(dirname $BASH_SOURCE)/../../data"
filter_file="$(dirname $BASH_SOURCE)/filter.txt"
jqfilter="$(cat $filter_file | tr '\n' ' ' )"

cat "$datadir/localist.json" | jq "$jqfilter" > "$datadir/custom.json"
