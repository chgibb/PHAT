"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["circularGenomeBuilder"] =
    {
        Create: function () {
            winMgr.pushWindow("circularGenomeBuilder", winMgr.createWithDefault("circularGenomeBuilder", "circularGenomeBuilder", 928, 300, "file://" + getAppPath_1.getReadable("circularGenomeBuilder.html"), false, false, 500, 150));
        }
    };
