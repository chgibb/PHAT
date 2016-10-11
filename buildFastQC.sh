rm -rf src/FastQC/bin
rmdir src/FastQC/bin

printf "Building FastQC\n"

cd src
cd FastQC
ant

cd ../
cd ../

printf "Bundling FastQC\n"

mkdir dist/FastQC

cp -r src/FastQC/bin/* dist/FastQC

rm dist/FastQC/README.txt
rm dist/FastQC/RELEASE_NOTES.txt
rm dist/FastQC/build.xml
rm dist/FastQC/EditedFiles
rm dist/FastQC/INSTALL.txt
rm dist/FastQC/fastqc_icon.ico
rm dist/FastQC/run_fastqc.bat

chmod +x dist/FastQC/fastqc
