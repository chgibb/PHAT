"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcMain;
const app = electron.app;
const jsonFile = require("jsonfile");
const BrowserWindow = electron.BrowserWindow;
require("./req/main/main");
