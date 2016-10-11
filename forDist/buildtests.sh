rm -rf tests
mkdir tests
mkdir tests/data
mkdir tests/resources
mkdir tests/resources/app
mkdir tests/resources/app/renderer
mkdir tests/resources/app/main
mkdir tests/resources/app/data

cp src/tests/data/*.* tests/data

cp src/tests/*.* tests/

cp -r src/tests/node_modules tests/

cp phat-linux-x64/resources/app/renderer/*.* tests/resources/app/renderer
cp phat-linux-x64/resources/app/main/*.* tests/resources/app/main

cp -r FastQC tests/resources/app

cp bowtie2 tests/resources/app
cp bowtie2-align-l tests/resources/app
cp bowtie2-align-s tests/resources/app
cp bowtie2-build tests/resources/app
cp bowtie2-build-l tests/resources/app
cp bowtie2-build-s tests/resources/app
cp bowtie2-inspect tests/resources/app
cp bowtie2-inspect-l tests/resources/app
cp bowtie2-inspect-s tests/resources/app
cp faToTwoBit tests/resources/app
cp fileSize tests/resources/app
cp QCReportCopy tests/resources/app
cp samtools tests/resources/app
