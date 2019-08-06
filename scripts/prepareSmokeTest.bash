 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

mkdir guiTests
./node_modules/.bin/tsc
for f in .buildCache/debug/src/guiTests/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub(".buildCache/debug/src/guiTests/","guiTests/");print}')
	printf $destination
	printf "\n"
	./node_modules/.bin/browserify $f --node --debug -o $destination --exclude electron
done
