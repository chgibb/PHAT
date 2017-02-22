(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
cp src/pileup.js/style/pileup.css dist/styles/pileup.css

for f in src/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","dist/");print}')
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing
done
