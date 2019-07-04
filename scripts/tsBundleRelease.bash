 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

destination=$(echo $1 | awk '{gsub("src/","");print}')

node scripts/rollup $1
if [ $? != 0 ]; then
printf "Could not rollup"
	exit 1
fi

./node_modules/.bin/browserify $1 --node --debug -o $1.tmp  --exclude electron --ignore-missing --noparse=jquery 
if [ $? != 0 ]; then
    rm $1.tmp
	exit $?
fi
mv $1.tmp $1

if [ "$1" != "src/PileupRenderer.js" ]; then
    ./node_modules/.bin/bundle-collapser $1 > $1.tmp
    if [ $? != 0 ]; then
        rm $1.tmp
        exit $?
    fi
    mv $1.tmp $1
fi

node scripts/babelMinify $1 > $1.tmp
if [ $? != 0 ]; then
    rm $1.tmp
    exit $?
fi
mv $1.tmp $1

if [ "$1" != "src/PileupRenderer.js" ]; then
    ./node_modules/uglify-es/bin/uglifyjs --compress inline=false,reduce_vars=0,reduce_funcs=0 -- $1 > $1.tmp
    if [ $? != 0 ]; then
        rm $1.tmp
        exit $?
    fi
    mv $1.tmp $1
fi

./node_modules/.bin/optimize-js $1 > $1.tmp
if [ $? != 0 ]; then
    rm $1.tmp
    exit $?
fi
mv $1.tmp $1

cp $1 .buildCache/release/$destination