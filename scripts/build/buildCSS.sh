(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
for f in src/styles/*.scss
do
	echo "Building "$f
	changeExtension=$(echo $f | awk '{gsub("scss","css");print}')
	./sassc $f > $changeExtension
	if [ $? != 0 ]; then
		exit 1
	fi
done
cp src/styles/*.css dist/styles
rm src/styles/*.css
cp forDist/styles/*.css dist/styles