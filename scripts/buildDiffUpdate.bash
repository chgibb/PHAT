(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

node scripts/downloadFullUpdateFromSecondLastTag chgibb phat $(node scripts/getReleaseTypeFromPackage)