dmd src/QCReportCopy/main.d src/QCReportCopy/qcartifacts.d -O -release -inline -ofQCReportCopy

cp QCReportCopy dist

rm QCReportCopy
rm QCReportCopy.o
