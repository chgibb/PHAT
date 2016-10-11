set -e

rm -rf dist

mkdir dist
 
#./node_modules/.bin/browserify src/main.js --node -o dist/main.js --ignore-missing

for f in src/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","dist/");print}')
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing
done



mkdir dist/img
cp img/*.* dist/img

mkdir dist/icons
cp icons/*.* dist/icons

cp src/*.html dist

cp -R forDist/* dist




electron-packager ./dist/ --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation

cp package.json phat-linux-x64/resources/app


