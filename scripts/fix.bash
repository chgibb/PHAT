./node_modules/.bin/eslint ./src/**/*.ts ./src/**/*.tsx --cache --fix
if [[ $? != 0 ]]; then
    exit 1
fi
