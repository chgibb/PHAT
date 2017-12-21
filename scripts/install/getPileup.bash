(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

wget "https://github.com/chgibb/pileup.js/releases/download/v0.6.9/pileup.js"
wget "https://github.com/chgibb/pileup.js/releases/download/v0.6.9/pileup.css"

mv pileup.js forDist
mv pileup.css forDist/styles/pileup.css