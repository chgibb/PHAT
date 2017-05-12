(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
bash scripts/cleanTests.bash
bash scripts/build.bash
bash scripts/optPackage.bash

cd phat-win32-x64

tar -zcvf phat-win32-x64-update.tar.gz --exclude=*.tar.gz *

cd ../
mv phat-win32-x64/*.tar.gz . 

node scripts/buildWinInstaller