(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
cd src
git clone https://github.com/chgibb/pileup.js
cd pileup.js
npm install
cd ../
cd ../

rm src/req/renderer/PathogenRenderer/pileup.js
cd src
cd pileup.js

npm run build

cd ../
cd ../
cp src/pileup.js/dist/pileup.js forDist
cp src/pileup.js/style/pileup.css forDist/styles/pileup.css

rm -rf src/pileup.js

