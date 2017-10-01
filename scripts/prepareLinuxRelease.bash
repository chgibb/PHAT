bash scripts/cleanTests.bash
bash scripts/build.bash
bash scripts/optPackage.bash
ls
cd phat-linux-x64

tar -zcvf phat-linux-x64-portable.tar.gz --exclude=*.tar.gz *

mv resources/app/installUpdateNotificationLinux resources/app/newinstallUpdateNotificationLinux
mv resources/app/installUpdateProcess resources/app/newinstallUpdateProcess
mv resources/app/installUpdateProcess.py resources/app/newinstallUpdateProcess.py

tar -zcvf phat-linux-x64-update-full.tar.gz --exclude=*.tar.gz *
cp phat-linux-x64-update-full.tar.gz phat-linux-x64-update.tar.gz

cd ../
mv phat-linux-x64/*.tar.gz .

bash scripts/buildDiffUpdate.bash

cd phat-linux-x64

mv resources/app/newinstallUpdateNotificationLinux resources/app/installUpdateNotificationLinux 
mv resources/app/newinstallUpdateProcess resources/app/installUpdateProcess 
mv resources/app/newinstallUpdateProcess.py resources/app/installUpdateProcess.py 

cd ../

printf "Building Debian installer\n"

echo installed > phat-linux-x64/resources/app/edition.txt

node scripts/buildDebianInstaller

mv deb/*.deb .

printf "Building RPM instaler\n"

./node_modules/.bin/electron-builder --prepackaged=phat-linux-x64 -l rpm
mv dist/*.rpm .