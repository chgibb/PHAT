(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

wget "https://github.com/samtools/samtools/releases/download/1.4.1/samtools-1.4.1.tar.bz2"

tar jxf samtools-1.4.1.tar.bz2
cd samtools-1.4.1
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    make
    cd ../
    cp samtools-1.4.1/samtools forDist/linux/samtools
fi

if [[ "$OSTYPE" == "cygwin" ]]; then
    #Windows isn't even supported by samtools so this is a huge hack to begin with
    #It's too much work (for now) to figure out how to build with bz2 and lzma support so just disable it
    #Also disable curses because we don't even use tview (for now)
    #This has the effect of disabling support for tview as well as any kind of CRAM handling
    ./configure --without-curses --disable-bz2 --disable-lzma
    make
    cd ../
    cp samtools-1.4.1/samtools.exe forDist/linux/samtools.exe
fi
rm -rf samtools-1.4.1
rm samtools-1.4.1.tar.bz2