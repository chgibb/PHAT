(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

if [[ "$APPVEYOR" == true ]]; then
    printf "Detected Appveyor\n"
    if [[ "$APPVEYOR_REPO_TAG" != true ]]; then
        printf "Not running tag build. Aborting artifact preparation.\n"
        exit 0
    fi
fi

bash scripts/cleanTests.bash
bash scripts/build.bash opt
bash scripts/compileCachesForRelease.bash

cd phat-win32-x64

mv resources/app/ICSharpCode.SharpZipLib.dll resources/app/newCSharpCode.SharpZipLib.dll
mv resources/app/installUpdateProcess.exe resources/app/newinstallUpdateProcess.exe
mv resources/app/installUpdateNotificationWin32.exe resources/app/newinstallUpdateNotificationWin32.exe

tar -zcvf phat-win32-x64-update-full.tar.gz --exclude=*.tar.gz *
cp phat-win32-x64-update-full.tar.gz phat-win32-x64-update.tar.gz

cd ../
mv phat-win32-x64/*.tar.gz .

bash scripts/buildDiffUpdate.bash

cd phat-win32-x64

mv resources/app/newCSharpCode.SharpZipLib.dll resources/app/ICSharpCode.SharpZipLib.dll 
mv resources/app/newinstallUpdateProcess.exe resources/app/installUpdateProcess.exe 
mv resources/app/newinstallUpdateNotificationWin32.exe resources/app/installUpdateNotificationWin32.exe

cd ../
mv phat-win32-x64/*.tar.gz . 

cd phat-win32-x64

jar -cMf phat-win32-x64-portable.zip .

cd ../
mv phat-win32-x64/*.zip .

node scripts/buildWinInstaller
