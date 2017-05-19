"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["output"] =
    {
        Create: function () {
            winMgr.pushWindow("output", winMgr.createWithDefault("Output", "output", 1379, 649, fsAccess_1.default("resources/app/Output.html"), false, false, 650, 420));
        }
    };
