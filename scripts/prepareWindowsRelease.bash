(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
bash scripts/cleanTests.bash
bash scripts/build.bash
bash scripts/optPackage.bash

cd phat-win32-x64

mv resources/app/ICSharpCode.SharpZipLib.dll resources/app/newCSharpCode.SharpZipLib.dll
mv resources/app/installUpdateProcess.exe resources/app/newinstallUpdateProcess.exe
mv resources/app/installUpdateNotificationWin32.exe resources/app/newinstallUpdateNotificationWin32.exe

tar -zcvf phat-win32-x64-update.tar.gz --exclude=*.tar.gz *

mv resources/app/newCSharpCode.SharpZipLib.dll resources/app/ICSharpCode.SharpZipLib.dll 
mv resources/app/newinstallUpdateProcess.exe resources/app/installUpdateProcess.exe 
mv resources/app/newinstallUpdateNotificationWin32.exe resourecs/app/installUpdateNotificationWin32.exe

cd ../
mv phat-win32-x64/*.tar.gz . 

cd phat-win32-x64

jar -cMf phat-win32-x64-portable.zip .

cd ../
mv phat-win32-x64/*.zip .

node scripts/buildWinInstaller

