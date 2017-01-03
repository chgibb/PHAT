for f in src/styles/*.scss
do
	echo "Building "$f
	changeExtension=$(echo $f | awk '{gsub("scss","css");print}')
	./sassc $f > $changeExtension
done
cp src/styles/*.css dist/styles
rm src/styles/*.css
