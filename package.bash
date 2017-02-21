 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

rm -rf dist
mkdir dist
cp package.json dist

if [[ "$OSTYPE" == "linux-gnu" ]]; then

    for f in forDist/linux/**
    do
        chmod +x $f
    done
    chmod +x src/FastQC/fastqc
    ./node_modules/.bin/electron-packager ./dist/ --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
    cp -R -v forDist/linux/** phat-linux-x64/resources/app
fi

if [[ "$OSTYPE" == "cygwin" ]]; then

    ./node_modules/.bin/electron-packager ./dist/ --platform win32 --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation
    cp -R -v forDist/win32/** phat-win32-x64/resources/app
fi
