(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
function cleanTSArtifacts {
	for f in $(find src -name '*.ts'); 
	do
		artifact=$(echo $f | awk '{gsub("\\.ts",".js");print}')
		rm $artifact
	done
	for f in $(find scripts -name '*.ts'); 
	do
		artifact=$(echo $f | awk '{gsub("\\.ts",".js");print}')
		rm $artifact
	done
}
cp src/pileup.js/style/pileup.css dist/styles/pileup.css

if [[ "$1" != "prod" ]]; then
	./node_modules/.bin/tsc
fi
if [[ "$1" == "opt" ]]; then
	./node_modules/.bin/tsc -p tsconfigProd.json
fi
#Compilation failed somewhere
if [ $? != 0 ]; then
    cleanTSArtifacts
	exit 1
fi
for f in src/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","dist/");print}')
	if [[ "$f" != "src/compileTemplatesProcess.js" ]]; then
		./node_modules/.bin/browserify $f --node --debug -o $destination  --exclude electron --ignore-missing --noparse=jquery
	fi
	if [[ "$f" == "src/compileTemplatesProcess.js" ]]; then
		./node_modules/.bin/browserify $f --node --debug -o $destination --exclude electron --ignore-missing  --require @chgibb/angularplasmid --noparse=jquery
	fi
	if [ $? != 0 ]; then
	cleanTSArtifacts
		exit 1
	fi
done

cleanTSArtifacts


