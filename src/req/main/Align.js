"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["align"] =
    {
        Create: function () {
            winMgr.pushWindow("align", winMgr.createWithDefault("Align", "align", 1000, 800, "file://" + getAppPath_1.getReadable("Align.html"), false, false, 500, 300));
        }
    };
