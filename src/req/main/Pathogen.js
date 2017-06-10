"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const getAppPath_1 = require("./../getAppPath");
winMgr.windowCreators["pathogen"] =
    {
        Create: function () {
            winMgr.pushWindow("pathogen", winMgr.createWithDefault("Pathogen", "pathogen", 1000, 800, "file://" + getAppPath_1.getReadable("Pathogen.html"), false, false, 500, 300));
        }
    };
