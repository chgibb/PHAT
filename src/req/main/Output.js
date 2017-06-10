"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["output"] =
    {
        Create: function () {
            winMgr.pushWindow("output", winMgr.createWithDefault("Output", "output", 1379, 649, "file://" + getAppPath_1.getReadable("Output.html"), false, false, 650, 420));
        }
    };
