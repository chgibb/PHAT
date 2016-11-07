set -e
cd tests

node tests.js

cd ../

for f in guiTests/*.js
do
	sh build.sh

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


