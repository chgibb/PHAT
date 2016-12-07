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
cp src/pileup.js/dist/pileup.js src/req/renderer/PathogenRenderer
cp src/pileup.js/style/pileup.css dist/styles/pileup.css

