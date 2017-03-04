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
	bash build.bash

	cd phat-linux-x64
	cd resources
	cd app
	rm main.js
	printf "Removed main\n"
	cd ../
	cd ../
	cd ../
	cp $f phat-linux-x64/resources/app/main.js
	printf "Replaced with $f\n"
	cd phat-linux-x64
	./phat
	cd ../

done


