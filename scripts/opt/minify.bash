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
        ./node_modules/nwsjs/nwsjs $f > tmp
        mv tmp $f
    fi
done