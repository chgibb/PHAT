 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

mkdir guiTests
./node_modules/.bin/tsc
for f in src/guiTests/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","guiTests/"); gsub("guiTests/guiTests/","guiTests/");print}')
	printf $destination
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing --exclude electron
done

for f in $(find src -name '*.ts'); 
do
	artifact=$(echo $f | awk '{gsub("\\.ts",".js");print}')
	rm $artifact
done