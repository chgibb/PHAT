 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

destination=$(echo $1 | awk '{gsub("src/","");print}')

node scripts/rollup $1
if [ $? != 0 ]; then
printf "Could not rollup"
	exit 1
fi

./node_modules/.bin/browserify $1 --node --debug -o .buildCache/debug/$destination  --exclude electron --ignore-missing --noparse=jquery 
if [ $? != 0 ]; then
	exit $?
fi