"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcMain;
const app = electron.app;
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
const dataMgr = require("./dataMgr");
winMgr.windowCreators["toolBar"] =
    {
        Create: function () {
            winMgr.pushWindow("toolBar", winMgr.createWithDefault("P. H. A. T.", "toolBar", 540, 84, fsAccess_1.default("resources/app/ToolBar.html"), false, false, 540, 84));
            let toolBarWindow = winMgr.getWindowsByName("toolBar");
            if (toolBarWindow.length > 0) {
                toolBarWindow[0].on("closed", function () {
                    if (!dataMgr.getKey("application", "downloadedUpdate")) {
                        dataMgr.saveData();
                        app.quit();
                    }
                });
            }
        }
    };
