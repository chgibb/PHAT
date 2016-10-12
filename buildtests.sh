sh clean.sh

sh build.sh

rm -rf tests
mkdir tests
mkdir tests/data
mkdir tests/resources

cp -r phat-linux-x64/resources/* tests/resources

cp -r testData/* tests/data

cp dist/tests.js tests

