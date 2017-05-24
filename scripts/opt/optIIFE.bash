(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi
if [[ "$APPVEYOR" == "true" ]]; then
    exit 0
for f in $target/*.js
do
    if [[ "$f" != "$target/pileup.js" ]]; then
        printf "Optimizing IIFEs $f\n"
        ./node_modules/.bin/optimize-js $f > tmp
        mv tmp $f
    fi
done