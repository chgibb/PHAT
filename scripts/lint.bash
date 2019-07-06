./node_modules/.bin/eslint ./src/**/*.ts ./src/**/*.tsx --cache
if [[ $? != 0 ]]; then
    exit 1
fi
