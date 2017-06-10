"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["input"] =
    {
        Create: function () {
            winMgr.pushWindow("input", winMgr.createWithDefault("Input", "input", 928, 300, "file://" + getAppPath_1.getReadable("Input.html"), false, false, 545, 85));
        }
    };
