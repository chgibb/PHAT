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



for f in scripts/build/*.sh
do
	sh $f
done
for f in scripts/build/*.bash
do
	bash $f
done

if [[ "$OSTYPE" == "linux-gnu" ]]; then
cp -R -v dist/** phat-linux-x64/resources/app
rm -rf dist
fi


if [[ "$OSTYPE" == "cygwin" ]]; then
cp -R -v dist/** phat-win32-x64/resources/app
rm -rf dist
fi


