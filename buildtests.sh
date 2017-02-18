
bash build.bash

rm -rf tests
mkdir tests
mkdir tests/data
mkdir tests/resources

cp -r phat-linux-x64/resources/* tests/resources

cp -r testData/* tests/data

cp dist/tests.js tests

mkdir guiTests

for f in src/guiTests/*.js
do
	printf "Bundling "
	printf $f
	printf "\n"
	destination=$(echo $f | awk '{gsub("src/","guiTests/"); gsub("guiTests/guiTests/","guiTests/");print}')
printf $destination
	./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing
done
