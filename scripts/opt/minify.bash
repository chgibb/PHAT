(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

for f in $target/*.js
do
    if [[ "$f" != "$target/pileup.js" ]]; then
        if [[ "$f" != "$target/tests.js" ]]; then
            printf "Compressing $f\n"

            node node_modules/uglify-es/bin/uglifyjs --compress -- $f > tmp
            mv tmp $f
        fi
    fi
done