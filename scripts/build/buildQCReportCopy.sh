printf "Building QCReportCopy\n"
dmd src/QCReportCopy/main.d src/QCReportCopy/qcartifacts.d -O -release -inline -ofQCReportCopy

printf "Bundling QCReportCopy\n"
cp QCReportCopy dist

rm QCReportCopy
rm QCReportCopy.o
