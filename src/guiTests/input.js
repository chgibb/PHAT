const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const jsonFile = require('jsonfile');
const BrowserWindow = electron.BrowserWindow;

var window = require('./../req/main/window');

require('./../req/main/main');



setTimeout(function(){
console.log(BrowserWindow.getAllWindows());

console.log(window.windows["toolBar"]);
window.windows["toolBar"].webContents.executeJavaScript("document.getElementById('input').click()");
app.quit();

},2000);



