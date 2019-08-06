 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

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
		cp $1 phat-linux-x64/resources/app/main.js
	fi
	if [[ "$OSTYPE" == "cygwin" ]]; then
		cp $1 phat-win32-x64/resources/app/main.js
	fi
	printf "Replaced with $1\n"
	if [[ "$OSTYPE" == "linux-gnu" ]]; then
		cd phat-linux-x64
	fi
	if [[ "$OSTYPE" == "cygwin" ]]; then
		cd phat-win32-x64
	fi
	./phat
	if [ $? != 0 ]; then
		exit 1
	fi
	cd ../