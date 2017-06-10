"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["host"] =
    {
        Create: function () {
            winMgr.pushWindow("host", winMgr.createWithDefault("Host", "host", 1000, 800, "file://" + getAppPath_1.getReadable("host.html"), false, false, 500, 300));
        }
    };
