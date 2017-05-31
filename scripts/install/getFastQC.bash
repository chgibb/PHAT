(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

wget "https://github.com/chgibb/FastQC0.11.5/releases/download/v0.11.5/FastQC.tar.gz"

tar -xzvf FastQC.tar.gz -C forDist
rm FastQC.tar.gz