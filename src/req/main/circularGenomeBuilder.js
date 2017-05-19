"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["circularGenomeBuilder"] =
    {
        Create: function () {
            winMgr.pushWindow("circularGenomeBuilder", winMgr.createWithDefault("circularGenomeBuilder", "circularGenomeBuilder", 928, 300, fsAccess_1.default("resources/app/circularGenomeBuilder.html"), false, false, 500, 150));
        }
    };
