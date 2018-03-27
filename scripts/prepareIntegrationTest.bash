 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

bash scripts/build.bash opt
if [ $? != 0 ]; then
	exit 1
fi

rm -rf tests
mkdir tests
mkdir tests/data
mkdir "tests/data with spaces"
mkdir tests/resources

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    cp -r phat-linux-x64/resources/* tests/resources
    cp phat-linux-x64/resources/app/tests.js tests

	echo portable > tests/edition
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    cp -r phat-win32-x64/resources/* tests/resources
    cp phat-win32-x64/resources/app/tests.js tests

	echo portable > tests/edition
fi
cp -r testData/* tests/data
cp -r testData/* "tests/data with spaces"
