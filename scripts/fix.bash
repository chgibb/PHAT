./node_modules/.bin/eslint --fix $(find src -name *.ts)
if [[ $? != 0 ]]; then
    exit 1
fi
