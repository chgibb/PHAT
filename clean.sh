rm -rf dist
rm -rf phat-linux-x64

for f in scripts/clean/*.sh
do
	sh $f
done

rm -rf node_modules
