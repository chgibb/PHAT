(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

for f in $target/*.js
do
    if [[ "$f" != "$target/PileupRenderer.js" ]]; then
        printf "Collapsing bundle $f\n"
        ./node_modules/.bin/bundle-collapser $f > tmp
        if [ $? != 0 ]; then
            rm temp
        fi
        if [ $? == 0 ]; then
            mv tmp $f
        fi
    fi
done