const fs = require("fs");

const electronInstaller = require('electron-winstaller');

let buildTime = 0;
let updateBuildTime = setInterval(() => {
  buildTime += 10;
  console.log("Current Build Time For Installer: "+buildTime+" seconds");
},10000);

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './phat-win32-x64',
    outputDirectory: '.',
    authors: 'Zehbe Lab',
    description: "Pathogen Host Analysis Tool",
    exe: 'phat.exe',
    noMsi: true,
    iconUrl : 'https://raw.githubusercontent.com/chgibb/PHAT/master/icons/phat.ico',
    loadingGif : 'img/PHATInstallerGIF.gif',
    setupIcon : 'icons/phat.ico'
  });

resultPromise.then(
  () => {
    fs.renameSync("Setup.exe","phat-win32-x64-setup.exe");
    clearInterval(updateBuildTime);
    }, (e) => {
      console.log(`No dice: ${e.message}`);
      clearInterval(updateBuildTime);
    });