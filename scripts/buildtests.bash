(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
bash scripts/build.bash

#rm -rf tests
#mkdir tests
#mkdir tests/data
#mkdir "tests/data with spaces"
#mkdir tests/resources

#if [[ "$OSTYPE" == "linux-gnu" ]]; then
#    cp -r phat-linux-x64/resources/* tests/resources
#    cp phat-linux-x64/resources/app/tests.js tests

#	echo portable > tests/edition
#fi
#if [[ "$OSTYPE" == "cygwin" ]]; then
#    cp -r phat-win32-x64/resources/* tests/resources
#    cp phat-win32-x64/resources/app/tests.js tests
#
#	echo portable > tests/edition
#fi
#cp -r testData/* tests/data
#cp -r testData/* "tests/data with spaces"

mkdir guiTests
./node_modules/.bin/tsc
for f in src/guiTests/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","guiTests/"); gsub("guiTests/guiTests/","guiTests/");print}')
	printf $destination
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing
done

for f in $(find src -name '*.ts'); 
do
	artifact=$(echo $f | awk '{gsub("\\.ts",".js");print}')
	rm $artifact
done