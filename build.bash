 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

#remove and recreate dist
rm -rf dist

mkdir dist
mkdir dist/styles

cp package.json dist

#copy images into dist
mkdir dist/img
cp img/*.* dist/img

#copy icons into dist
mkdir dist/icons
cp icons/*.* dist/icons

#copy all html into dist
cp src/*.html dist


#for each script in scripts/build, run it
for f in scripts/build/*.sh
do
	sh $f
done
for f in scripts/build/*.bash
do
	bash $f
done

#Remove code cache
if [[ "$OSTYPE" == "linux-gnu" ]]; then
	rm -rf phat-linux-x64/resources/app/cdata
fi

if [[ "$OSTYPE" == "cygwin" ]]; then
	phat-win32-x64/resources/app/cdata
fi


#if linux then copy everything in dist into the created electron linux package
if [[ "$OSTYPE" == "linux-gnu" ]]; then
	cp -R -v dist/** phat-linux-x64/resources/app
	
	#remove dist
	rm -rf dist
fi

#if windows then copy everything in dist into the created electron windows package
if [[ "$OSTYPE" == "cygwin" ]]; then
	cp -R -v dist/** phat-win32-x64/resources/app

	#remove dist
	rm -rf dist
fi


