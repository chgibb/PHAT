if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

for f in $target/*.js
do
    printf "Compressing $f\n"
    ./node_modules/nwsjs/nwsjs $f --comments --spaces --tabs --newLines > tmp
    mv tmp $f
done