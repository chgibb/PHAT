bash scripts/cleanTests.bash
bash scripts/build.bash
bash scripts/optPackage.bash
ls
cd phat-linux-x64

tar -zcvf phat-linux-x64-portable.tar.gz --exclude=*.tar.gz *
tar -zcvf phat-linux-x64-update.tar.gz --exclude=*.tar.gz *

cd ../
mv phat-linux-x64/*.tar.gz .

echo installed > phat-linux-x64/edition

node scripts/buildDebianInstaller

mv deb/*.deb .

sudo add-apt-repository ppa:snappy-dev/tools -y
sudo apt-get update
sudo apt-get install snapcraft

node_modules/.bin/electron-builder --prepackaged=phat-linux-x64 --linux snap

mv dist/*.snap .
