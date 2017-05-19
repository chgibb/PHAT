"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["pathogen"] =
    {
        Create: function () {
            winMgr.pushWindow("pathogen", winMgr.createWithDefault("Pathogen", "pathogen", 1000, 800, fsAccess_1.default("resources/app/Pathogen.html"), false, false, 500, 300));
        }
    };
