"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["host"] =
    {
        Create: function () {
            winMgr.pushWindow("host", winMgr.createWithDefault("Host", "host", 1000, 800, fsAccess_1.default("resources/app/host.html"), false, false, 500, 300));
        }
    };
