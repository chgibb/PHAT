(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

cp node_modules/rangeslider.js/dist/rangeslider.css forDist/rangeslider.css

# FIX THIS SO ITS NOT TRASH
cp node_modules/rangeslider.js/dist/rangeslider.min.js forDist/rangeslider.min.js
