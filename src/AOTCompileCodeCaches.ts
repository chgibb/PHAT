import * as electron from "electron";
let app = electron.app;

require("./req/main/main");

import * as winMgr from "./req/main/winMgr";

//This script bootstraps the apps main process and opens each window so code caches
//for each window can be ahead of time compiled. This gets invoked through opPackage.bash
const sleep = require("./req/sleep");
setTimeout
(
    function()
    {
        winMgr.windowCreators["input"].Create();
        setTimeout
        (
            function()
            {
                winMgr.windowCreators["QC"].Create();
                setTimeout
                (
                    function()
                    {
                        winMgr.windowCreators["align"].Create();
                        setTimeout
                        (
                            function()
                            {
                                winMgr.windowCreators["pathogen"].Create();
                                setTimeout
                                (
                                    function()
                                    {
                                        let patho = winMgr.getWindowsByName("pathogen");
                                        patho[0].webContents.executeJavaScript(
                                            `
                                                require("./bootStrapCodeCache")("resources/app/pileup.js","./pileup","resources/app/cdata/pileup.cdata");
                                            `);
                                        winMgr.windowCreators["output"].Create();
                                        setTimeout
                                        (
                                            function()
                                            {
                                                winMgr.windowCreators["circularGenomeBuilder"].Create();
                                                setTimeout
                                                (
                                                    function()
                                                    {
                                                        app.quit();
                                                    },1000
                                                );
                                            },3000
                                        );
                                    },1000
                                );
                            },1000
                        );
                    },1000
                );
            },1000
        );
    },5000
);
