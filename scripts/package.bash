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

    #create electron package
    ./node_modules/.bin/electron-packager ./dist/ --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
    
    #copy in all 3rd party linux dependencies
    for f in forDist/linux/*.tar.gz
    do
        tar -xzvf $f -C phat-linux-x64/resources/app
    done
    for f in forDist/linux/*
    do
        if [ "$f" == "forDist/linux/linux.tar.gz" ]; then
            continue
        fi
        cp $f phat-linux-x64/resources/app
    done
    cp -R forDist/FastQC phat-linux-x64/resources/app
fi

#if windows
if [[ "$OSTYPE" == "cygwin" ]]; then

    #create electron package
    ./node_modules/.bin/electron-packager ./dist/ --platform win32 --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation --version-string.LegalCopyright=MIT --version-string.FileDescription=PHAT --version-string.ProductName=PHAT
    
    #copy in all 3rd party windows dependencies
    for f in forDist/win32/*.tar.gz
    do
        tar -xzvf $f -C phat-win32-x64/resources/app
    done
    cp -R forDist/FastQC phat-win32-x64/resources/app
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

if [[ "$OSTYPE" == "cygwin" ]]; then
    printf "Running icacls\n"
    ./scripts/setPerms.bat
    #cmd /c "icacls phat-win32-x64\\* /grant Everyone:(OI)(CI)F /T"
    printf "Done running icacls\n"
    #cmd /c "icacls phat-win32-x64\* /q /c /t /reset"
    
fi
