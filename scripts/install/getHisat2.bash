(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    wget "http://ccb.jhu.edu/software/hisat2/dl/hisat2-2.1.0-Linux_x86_64.zip"
    
    unzip hisat2-2.1.0-Linux_x86_64.zip
    
    cp hisat2-2.1.0/hisat2 forDist
    cp hisat2-2.1.0//hisat2-build forDist
    cp hisat2-2.1.0/hisat2-build-s forDist
    cp hisat2-2.1.0/hisat2-build-l forDist
    cp hisat2-2.1.0/hisat2-align-s forDist
    cp hisat2-2.1.0/hisat2-align-l forDist
    cp hisat2-2.1.0/hisat2-inspect forDist
    cp hisat2-2.1.0/hisat2-inspect-s forDist
    cp hisat2-2.1.0/hisat2-inspect-l forDist
    
    rm hisat2-2.1.0-Linux_x86_64.zip
    rm -rf hisat2-2.1.0
fi

if [[ "$OSTYPE" == "cygwin" ]]; then
	wget "http://www.di.fc.ul.pt/~afalcao/hisat2.1/hisat2.1_Windows.zip"
fi