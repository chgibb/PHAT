(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
function cleanTSArtifacts {
	for f in $(find src -name '*.js'); 
	do
		rm $f
	done
}

cp src/pileup.js/style/pileup.css dist/styles/pileup.css

if [[ "$1" != "opt" ]]; then
	./node_modules/.bin/tsc
	if [ $? != 0 ]; then
		exit 1
	fi

	cp src/*.html phat-linux-x64/resources/app
	cd .buildCache/debug/src; cp -R . ../../../phat-linux-x64/resources/app;
fi

if [[ "$1" == "opt" ]]; then
	./node_modules/.bin/tsc -p tsconfigProd.json
	if [ $? != 0 ]; then
		exit 1
	fi

	cd scripts

	./../node_modules/.bin/tsc -p tsconfig.json
	if [ $? != 0 ]; then
		exit 1
	fi

	cd ../
	
	node scripts/tsBundle src/*.ts src/*.tsx --release --buildCmd="bash scripts/tsBundleRelease.bash"
	cp .buildCache/release/*.js dist
fi

cleanTSArtifacts
