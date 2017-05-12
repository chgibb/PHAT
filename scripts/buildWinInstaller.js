var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './phat-win32-x64',
    outputDirectory: './phat-installer-x64',
    authors: 'Zehbe Lab',
    description: "Pathogen Host Analysis Tool",
    exe: 'phat.exe',
    noMsi: true
   // iconUrl: './icons/phat.ico',
    //setupIcon: './icons/phat.ico'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));