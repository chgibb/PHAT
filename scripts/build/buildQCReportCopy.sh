(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
printf "Building QCReportCopy\n"
dmd src/QCReportCopy/main.d src/QCReportCopy/qcartifacts.d -O -release -inline -ofQCReportCopy

printf "Bundling QCReportCopy\n"
cp QCReportCopy dist

rm QCReportCopy
rm QCReportCopy.o
rm QCReportCopy.obj
