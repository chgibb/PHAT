if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

for f in $target/*.js
do
    printf "Optimizing IIFEs $f\n"
    ./node_modules/.bin/optimize-js $f > tmp
    mv tmp $f
done