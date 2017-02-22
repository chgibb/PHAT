 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

#remove dist
rm -rf dist
mkdir dist

#copy package.json into dist. Electron will use dist to generate an empty app
#but it still needs a package.json
cp package.json dist

#if linux
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    
    #set fastqc to be executable
    chmod +x src/FastQC/fastqc

    #create electron package
    ./node_modules/.bin/electron-packager ./dist/ --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
    
    #copy in all 3rd party linux dependencies
    tar -xzvf forDist/linux/linux.tar.gz -C phat-linux-x64/resources/app
    for f in forDist/linux/*
    do
        if [ "$f" == "forDist/linux/linux.tar.gz" ]; then
            continue
        fi
        cp $f phat-linux-x64/resources/app
    done
fi

#if windows
if [[ "$OSTYPE" == "cygwin" ]]; then

    #create electron package
    ./node_modules/.bin/electron-packager ./dist/ --platform win32 --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
    
    #copy in all 3rd party windows dependencies
    tar -xzvf forDist/win32/win32.tar.gz -C phat-win32-x64/resources/app
fi

#for everything in the top level of forDist (should be cross platform stuff only in the top level)
for f in forDist/*
do
    #if linux then copy into the created electron linux package
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        cp $f phat-linux-x64/resources/app
    fi

    #if windows then copy into the created electron windows package
    if [[ "$OSTYPE" == "cygwin" ]]; then
        cp $f phat-win32-x64/resources/app
    fi
done
