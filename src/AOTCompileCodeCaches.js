"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
let app = electron.app;
require("./req/main/main");
const winMgr = require("./req/main/winMgr");
const sleep = require("./req/sleep");
setTimeout(function () {
    winMgr.windowCreators["input"].Create();
    setTimeout(function () {
        winMgr.windowCreators["QC"].Create();
        setTimeout(function () {
            winMgr.windowCreators["align"].Create();
            setTimeout(function () {
                winMgr.windowCreators["pathogen"].Create();
                setTimeout(function () {
                    let patho = winMgr.getWindowsByName("pathogen");
                    patho[0].webContents.executeJavaScript(`
                                                require("./bootStrapCodeCache")("resources/app/pileup.js","./pileup","resources/app/cdata/pileup.cdata");
                                            `);
                    winMgr.windowCreators["output"].Create();
                    setTimeout(function () {
                        winMgr.windowCreators["circularGenomeBuilder"].Create();
                        setTimeout(function () {
                            app.quit();
                        }, 1000);
                    }, 3000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}, 5000);
