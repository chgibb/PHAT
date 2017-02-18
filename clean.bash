#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
rm -rf dist
rm -rf phat-linux-x64

for f in scripts/clean/*.sh
do
	sh $f
done

rm -rf node_modules
