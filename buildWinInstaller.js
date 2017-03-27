var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './phat-win32-x64',
    outputDirectory: './installer64',
    authors: 'My App Inc.',
    exe: 'phat.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));