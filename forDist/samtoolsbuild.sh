rm -f samtools

cd src
cd samtools

make

cd ../
cd ../

cp src/samtools/samtools ./samtools

chmod +x ./samtools
