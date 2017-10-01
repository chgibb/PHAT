(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64"
fi

./node_modules/.bin/tsc

node scripts/downloadFullUpdateFromSecondLastTag chgibb phat $(node scripts/getReleaseTypeFromPackage)

mkdir phat-update-full-old
tar -xzvf phat-update-full.tar.gz -C phat-update-full-old
cp -R $target phat-update-diff

printf "Generating delta update package\n"
node scripts/diffAndBuildPatch phat-update-diff phat-update-full-old

rm phat-update-full.tar.gz
rm -rf phat-update-full-old

for f in phat-update-diff/resources/app/*.cdata
do
    rm $f
done

printf "Packing diff\n"

cd phat-update-diff
tar -zcvf $target-update-diff.tar.gz *
cd ../
mv phat-update-diff/*.tar.gz .

rm -rf phat-update-diff