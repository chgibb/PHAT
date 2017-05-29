if [[ "$OSTYPE" == "linux-gnu" ]]; then
wget "https://github.com/samtools/samtools/releases/download/1.4.1/samtools-1.4.1.tar.bz2"

tar jxf samtools-1.4.1.tar.bz2
cd samtools-1.4.1
make
cd ../
cp samtools-1.4.1/samtools forDist/linux/samtools
rm -rf samtools-1.4.1
rm samtools-1.4.1.tar.bz2

fi