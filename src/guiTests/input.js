console.log("started GUI test for input");
const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const jsonFile = require('jsonfile');
const BrowserWindow = electron.BrowserWindow;

var assert = require("./../req/tests/assert");

var window = require('./../req/main/window');

require('./../req/main/main');

console.log("Started test");
assert.runningEvents += 1;



assert.assert(function(){
    if(window.windows["input"])
        return true;
    return false;
},"Opened Input window",0);

assert.runAsserts();

setTimeout(function(){
window.windows["toolBar"].webContents.executeJavaScript("document.getElementById('input').click()");
assert.runningEvents -= 1;
},3000);

