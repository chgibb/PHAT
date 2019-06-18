import * as electron from "electron";
let app = electron.app;

import "./req/main/main";

import * as winMgr from "./req/main/winMgr";

//This script bootstraps the apps main process and opens each window so code caches
//for each window can be ahead of time compiled. This gets invoked through optPackage.bash
setTimeout(
    function()
    {
        console.log("opening input");
        winMgr.windowCreators["input"].Create();
        setTimeout(
            function()
            {
                console.log("opening QC");
                winMgr.windowCreators["QC"].Create();
                setTimeout(
                    function()
                    {
                        console.log("opening align");
                        winMgr.windowCreators["align"].Create();
                        setTimeout(
                            function()
                            {
                                console.log("opening pileup");
                                winMgr.windowCreators["pileup"].Create();
                                setTimeout
                                (
                                    function()
                                    {
                                        console.log("opening output");
                                        winMgr.windowCreators["output"].Create();
                                        setTimeout
                                        (
                                            function()
                                            {
                                                console.log("opening circularGenomeBuilder");
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
