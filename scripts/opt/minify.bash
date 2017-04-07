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
        printf "Compressing $f\n"
        if [[ "$OSTYPE" == "linux-gnu" ]]; then
            ./node_modules/nwsjs/nwsjs $f > tmp
        fi
        if [[ "$OSTYPE" == "cygwin" ]]; then
            ./node_modules/nwsjs/nwsjs.exe $f > tmp
        fi
        mv tmp $f
    fi
done