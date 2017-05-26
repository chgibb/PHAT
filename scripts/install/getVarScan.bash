(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

wget "https://github.com/dkoboldt/varscan/releases/download/2.4.2/VarScan.v2.4.2.jar"

mv VarScan.v2.4.2.jar forDist/varscan.jar