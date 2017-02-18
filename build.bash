 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

rm -rf dist

mkdir dist
mkdir dist/styles

cp package.json dist

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
for f in scripts/build/*.bash
do
	bash $f
done

if [[ "$OSTYPE" == "linux-gnu" ]]; then
	./node_modules/.bin/electron-packager ./dist/ --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
fi

if [[ "$OSTYPE" == "cygwin" ]]; then
	./node_modules/.bin/electron-packager ./dist/ --platform win32 --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
fi
cp package.json phat-linux-x64/resources/app


