(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
function cleanTSArtifacts {
	for f in $(find src -name '*.ts'); 
	do
		artifact=$(echo $f | awk '{gsub("\\.ts",".js");print}')
		rm $artifact
	done
}

cp src/pileup.js/style/pileup.css dist/styles/pileup.css

if [[ "$1" != "opt" ]]; then
	./node_modules/.bin/tsc
	if [ $? != 0 ]; then
		exit 1
	fi
	node scripts/tsBundle src/*.ts --debug --buildCmd="scripts/tsBundleDebug.bash"
	cp .buildCache/debug/*.js dist
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
	
	node scripts/tsBundle src/*.ts --release --buildCmd="scripts/tsBundleRelease.bash"
	cp .buildCache/release/*.js dist
fi

cleanTSArtifacts

