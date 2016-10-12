rm -rf dist
rm -rf phat-linux-x64
rm -rf tests

for f in scripts/clean/*.sh
do
	sh $f
done
