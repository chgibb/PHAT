set -e

sudo dpkg -R -i scripts/install

cd src
git clone https://github.com/chgibb/pileup.js
cd pileup.js
npm install
cd ../
cd ../
