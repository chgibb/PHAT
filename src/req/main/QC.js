"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["QC"] =
    {
        Create: function () {
            winMgr.pushWindow("QC", winMgr.createWithDefault("Fastq QC", "QC", 1000, 800, "file://" + getAppPath_1.getReadable("QC.html"), false, false, 550, 150));
        }
    };
