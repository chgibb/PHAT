 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

cd src/unitTests
./../../node_modules/.bin/tsc
if [ $? != 0 ]; then
    exit 1
fi

cd ../
cd ../

./node_modules/.bin/jest
if [ $? != 0 ]; then
    exit 1
fi