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
	sh $f $1
	if [ $? != 0 ]; then
		exit 1
	fi
done
for f in scripts/build/*.bash
do
	bash $f $1
	if [ $? != 0 ]; then
		exit 1
	fi
done

#Remove code cache
if [[ "$OSTYPE" == "linux-gnu" ]]; then
	rm -rf phat-linux-x64/resources/app/cdata
fi

if [[ "$OSTYPE" == "cygwin" ]]; then
	rm -rf phat-win32-x64/resources/app/cdata
fi


#if linux then copy everything in dist into the created electron linux package
if [[ "$OSTYPE" == "linux-gnu" ]]; then
	printf "Copying built files\n"
	cp -R dist/** phat-linux-x64/resources/app > /dev/null
	printf "Done\n"
	echo portable > phat-linux-x64/resources/app/edition.txt
	
	#remove dist
	rm -rf dist
fi

#if windows then copy everything in dist into the created electron windows package
if [[ "$OSTYPE" == "cygwin" ]]; then
	printf "Copying built files\n"
	cp -R dist/** phat-win32-x64/resources/app > /dev/null
	printf "Done\n"
	echo portable > phat-win32-x64/resources/app/edition.txt

	#remove dist
	rm -rf dist

	#cmd /c "icacls phat-win32-x64\* /q /c /t /reset"
	#cmd /c "icacls phat-win32-x64\* /grant Everyone:(OI)(CI)F /T"
	printf "Running icacls\n"
    ./scripts/setPerms.bat
    printf "Done running icacls\n"
    #
fi


