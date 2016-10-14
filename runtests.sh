cd tests

node tests.js

for f in guiTests/*.js
do

	cd phat-linux-x64
	cd resources
	cd app
	rm main.js
	cd ../
	cd ../
	cd ../
	cp $f phat-linux-x64/resources/app/main.js
	cd phat-linux-x64
	./phat
	cd ../

done
