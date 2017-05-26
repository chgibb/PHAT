 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

cd tests

node tests.js
if [ $? != 0 ]; then
	exit 1
fi

cd ../

for f in guiTests/*.js
do
	bash scripts/build.bash

	if [[ "$OSTYPE" == "linux-gnu" ]]; then
		cd phat-linux-x64
	fi
	if [[ "$OSTYPE" == "cygwin" ]]; then
		cd phat-win32-x64
	fi
	cd resources
	cd app
	rm main.js
	printf "Removed main\n"
	cd ../
	cd ../
	cd ../
	if [[ "$OSTYPE" == "linux-gnu" ]]; then
		cp $f phat-linux-x64/resources/app/main.js
	fi
	if [[ "$OSTYPE" == "cygwin" ]]; then
		cp $f phat-win32-x64/resources/app/main.js
	fi
	printf "Replaced with $f\n"
	if [[ "$OSTYPE" == "linux-gnu" ]]; then
		cd phat-linux-x64
	fi
	if [[ "$OSTYPE" == "cygwin" ]]; then
		cd phat-win32-x64
	fi
	./phat
	cd ../

	cat tests/jobVerboseLog.txt
	cat tests/jobErrorLog.txt

done


