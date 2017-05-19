"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winMgr = require("./winMgr");
const fsAccess_1 = require("./../fsAccess");
winMgr.windowCreators["input"] =
    {
        Create: function () {
            winMgr.pushWindow("input", winMgr.createWithDefault("Input", "input", 928, 300, fsAccess_1.default("resources/app/Input.html"), false, false, 545, 85));
        }
    };
