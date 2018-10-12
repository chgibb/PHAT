(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

wget "https://raw.githubusercontent.com/twbs/bootstrap/v3.3.7/dist/css/bootstrap.min.css"

mv bootstrap.min.css forDist