console.log("Started GUI test for New Project");
require("./../req/main/main");

import * as winMgr from "./../req/main/winMgr";

setTimeout(function(){
    let projSelection = winMgr.getWindowsByName("projectSelection");
    if(!projSelection || projSelection.length == 0)
    {
        console.log("Failed to open projectSelectionRenderer");
        process.exit(1);
    }
    projSelection[0].webContents.executeJavaScript(`
        const electron = require("electron");
        const ipc = electron.ipcRenderer;
        ipc.send(
            "runOperation",
            {
                opName : "newProject",
                name : "New Project Test"
            }
        );
    `);
    setTimeout(function(){
        projSelection[0].webContents.executeJavaScript(`
            let els = document.getElementsByClassName("activeHover");
            let isOpenLink = /open/i;
            if(isOpenLink.test(els[0].id))
            {
                els[0].click();
            }
        `);
        setTimeout(function(){
            let toolBar = winMgr.getWindowsByName("toolBar");
            if(!toolBar || toolBar.length > 1 || toolBar.length == 0)
            {
                console.log("Failed to open tool bar!");
                process.exit(1);
            }
            toolBar[0].close();
        },1000);
    },1000);
},1500);
