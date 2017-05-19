"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["QC"] =
    {
        Create: function () {
            winMgr.pushWindow("QC", winMgr.createWithDefault("Fastq QC", "QC", 1000, 800, fsAccess_1.default("resources/app/QC.html"), false, false, 550, 150));
        }
    };
