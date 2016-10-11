rm -rf src/FastQC/bin
rmdir src/FastQC/bin

rm -rf FastQC
rmdir FastQC


cd src
cd FastQC
ant

cd ../
cd ../

mkdir FastQC

cp -r src/FastQC/bin/* FastQC

rm FastQC/README.txt
rm FastQC/RELEASE_NOTES.txt
rm FastQC/build.xml
rm FastQC/EditedFiles
rm FastQC/INSTALL.txt
rm FastQC/fastqc_icon.ico
rm FastQC/run_fastqc.bat

chmod +x FastQC/fastqc
