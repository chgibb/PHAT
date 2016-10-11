mkdir main
mkdir renderer


cp src/*.js ./
cp src/*.html ./

cp src/renderer/*.html ./

cat src/main/main/Globals.js > main/main.js

for f in src/main/*.js 
do
	folder=${f%.js}

	destination=$(echo $f | awk '{gsub("src/","");print}')


	for k in "$folder"/*.js
	do
		if [ "$k" != "src/main/main/Globals.js" ]; then
			cat $k >> $destination
		fi
	done

	cat $f >> $destination
done

#cat src/main/*.js > main/main.js



#compile all .js files in the root of renderer with their corresponding files in renderer/file
#i.e. src/renderer/foo.js
#     will result in renderer/foo.js 
#     which will include src/renderer/foo/*.js
#     and src/renderer/foo.js

for f in src/renderer/*.js 
do
	folder=${f%.js}

	destination=$(echo $f | awk '{gsub("src/","");print}')


	for k in "$folder"/*.js
	do
		cat $k >> $destination
	done

	cat $f >> $destination
done




sh qcreportcopybuild.sh
#sh filesizebuild.sh
#sh samtoolsbuild.sh

#sh fastqcbuild.sh




electron-packager . --platform linux --arch x64 --overwrite --ignore=node_modules --ignore=.jsx --ignore=build.sh --ignore=src --ignore=vcs  --ignore=.sh --ignore=notes --ignore=manuscript --ignore=presentation --ignore=tests

cp install.sh phat-linux-x64

#sh run.sh

rm *.node
#rm *.js
rm *.html

rm -rf main
rm -rf renderer

rmdir renderer
rmdir main



