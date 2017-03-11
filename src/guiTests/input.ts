/*const electron = require('electron');
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
    for(let i = 0; i != window.windows.length; ++i)
    {
        if(window.windows[i].name == "input")
            return true;
    }
    return false;
},"Opened Input window",0);

assert.runAsserts();

setTimeout(function(){
    window.windows["toolBar"].webContents.executeJavaScript("document.getElementById('input').click()");
    setTimeout(function(){
        assert.runningEvents -= 1;
    },10000);
},3000);
*/
console.log("started GUI test for input");
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
import * as winMgr from "./../req/main/winMgr";
const jsonFile = require("jsonfile");
const BrowserWindow = electron.BrowserWindow;
require("./../req/main/main");

let assert = require("./../req/tests/assert");

assert.runningEvents += 1;

assert.assert(function(){
    let windows = winMgr.getWindowsByName("input");
    if(windows && windows.length > 0)
        return true;
    return false;
},"Opened Input window",0);

assert.runAsserts();

setTimeout(function(){
    let toolBar = winMgr.getWindowsByName("toolBar");
    toolBar[0].webContents.executeJavaScript("document.getElementById('input').click()");
    setTimeout(function(){
        assert.runningEvents -= 1;
    },10000);
},3000);