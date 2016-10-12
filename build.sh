set -e

rm -rf dist

mkdir dist
 

mkdir dist/img
cp img/*.* dist/img

mkdir dist/icons
cp icons/*.* dist/icons

cp src/*.html dist

cp -R forDist/* dist

for f in scripts/build/*.sh
do
	sh $f
done


electron-packager ./dist/ --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation

cp package.json phat-linux-x64/resources/app


