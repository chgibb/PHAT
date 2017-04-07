/**
 * Main entry point for the main application process.
 * @module main
 */
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
const jsonFile = require("jsonfile");
const BrowserWindow = electron.BrowserWindow;

require("./req/main/main");