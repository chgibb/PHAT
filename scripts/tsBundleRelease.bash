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

if [ "$1" != "src/circularGenomeBuilderRenderer.js" ]; then
    ./node_modules/.bin/babel --plugins minify-mangle-names $1 > $1.tmp
    if [ $? != 0 ]; then
        rm $1.tmp
        exit $?
    fi
    mv $1.tmp $1
fi

#AngularJS depends on parameter names where the parameter is passed as a service. For instance "$compile".
#We preserve a list of used services when mangling the genome builder
if [ "$1" == "src/circularGenomeBuilderRenderer.js" ]; then
    node scripts/genomeBuilderMangle $1 > $1.tmp
    if [ $? != 0 ]; then
        rm $1.tmp
        exit $?
    fi
    mv $1.tmp $1
fi

if [ "$1" != "src/PileupRenderer.js" ]; then
    ./node_modules/uglify-es/bin/uglifyjs --compress -- $1 > $1.tmp
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