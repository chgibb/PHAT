rm src/req/renderer/PathogenRenderer/pileup.js
cd src
cd pileup.js

npm run build

cd ../
cd ../
cp src/pileup.js/dist/pileup.js src/req/renderer/PathogenRenderer
cp src/pileup.js/style/pileup.css dist/styles/pileup.css

for f in src/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","dist/");print}')
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing
done
