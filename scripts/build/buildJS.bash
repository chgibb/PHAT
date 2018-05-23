(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
function cleanTSArtifacts {
	for f in $(find src -name '*.ts'); 
	do
		artifact=$(echo $f | awk '{gsub("\\.ts",".js");print}')
		rm $artifact
	done
}
cp src/pileup.js/style/pileup.css dist/styles/pileup.css

if [[ "$1" != "prod" ]]; then
	./node_modules/.bin/tsc
	if [ $? != 0 ]; then
		exit 1
	fi
fi
if [[ "$1" == "opt" ]]; then
	./node_modules/.bin/tsc -p tsconfigProd.json
	if [ $? != 0 ]; then
		exit 1
	fi
fi


if [[ "$1" == "opt" ]]; then
	for f in src/*.js
	do
		destination=$(echo $f | awk '{gsub("src/","dist/");print}')
		printf "Shaking "
		printf $f
		printf "\n"
		node scripts/rollup $f
		if [ $? != 0 ]; then
			cleanTSArtifacts
			exit 1
		fi
	done
fi

i=0
for f in src/*.js
do
	destination=$(echo $f | awk '{gsub("src/","dist/");print}')

	printf "Bundling "
	printf $f
	printf "\n"

	./node_modules/.bin/browserify $f --node --debug -o $destination  --exclude electron --ignore-missing --noparse=jquery 
	
	if [ $? != 0 ]; then
	cleanTSArtifacts
		exit 1
	fi

	i=$i+1
	if [[ $(($i%2)) == 0 ]]; then
		wait ${!}
	fi
done

wait 

cleanTSArtifacts

