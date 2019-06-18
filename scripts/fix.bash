./node_modules/.bin/eslint --fix $(find src -name *.ts -o -name *.tsx)
if [[ $? != 0 ]]; then
    exit 1
fi
