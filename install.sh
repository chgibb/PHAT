set -e

for f in scripts/install/*.sh
do
	sudo sh $f
done
