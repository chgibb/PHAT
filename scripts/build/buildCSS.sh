(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
for f in src/styles/*.scss
do
	echo "Building "$f
	changeExtension=$(echo $f | awk '{gsub("scss","css");print}')
	./sassc $f > $changeExtension
done
cp src/styles/*.css dist/styles
rm src/styles/*.css
