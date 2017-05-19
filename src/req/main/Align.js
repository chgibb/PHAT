"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["align"] =
    {
        Create: function () {
            winMgr.pushWindow("align", winMgr.createWithDefault("Align", "align", 1000, 800, fsAccess_1.default("resources/app/Align.html"), false, false, 500, 300));
        }
    };
