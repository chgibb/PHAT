(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
cp src/pileup.js/style/pileup.css dist/styles/pileup.css

./node_modules/.bin/tsc
for f in src/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","dist/");print}')
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing
done

for f in $(find src -name '*.ts'); 
do 
	artifact=$(echo $f | awk '{gsub(".ts",".js");print}')
	rm $artifact
done
