"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("started GUI test for input");
const electron = require("electron");
const ipc = electron.ipcMain;
const app = electron.app;
const winMgr = require("./../req/main/winMgr");
const jsonFile = require("jsonfile");
const BrowserWindow = electron.BrowserWindow;
require("./../req/main/main");
let assert = require("./../req/tests/assert");
assert.runningEvents += 1;
assert.assert(function () {
    let windows = winMgr.getWindowsByName("input");
    if (windows && windows.length > 0)
        return true;
    return false;
}, "Opened Input window", 0);
assert.runAsserts();
setTimeout(function () {
    let toolBar = winMgr.getWindowsByName("toolBar");
    toolBar[0].webContents.executeJavaScript("document.getElementById('input').click()");
    setTimeout(function () {
        assert.runningEvents -= 1;
    }, 10000);
}, 3000);
