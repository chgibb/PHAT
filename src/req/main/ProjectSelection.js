"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const app = electron.app;
const winMgr = require("./winMgr");
const dataMgr = require("./dataMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["projectSelection"] =
    {
        Create: function () {
            winMgr.pushWindow("projectSelection", winMgr.createWithDefault("ProjectSelection", "projectSelection", 400, 800, "file://" + getAppPath_1.getReadable("ProjectSelection.html"), false, false, 10, 10));
            let projectSelectWindow = winMgr.getWindowsByName("projectSelection");
            if (projectSelectWindow.length > 0) {
                projectSelectWindow[0].on("closed", function () {
                    let toolBarWindow = winMgr.getWindowsByName("toolBar");
                    if (toolBarWindow.length == 0) {
                        if (!dataMgr.getKey("application", "downloadedUpdate")) {
                            dataMgr.saveData();
                            app.quit();
                        }
                    }
                });
            }
        }
    };
