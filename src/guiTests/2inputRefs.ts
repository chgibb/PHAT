console.log("Started GUI test for ref seq inputing");
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
        toolBar[0].webContents.executeJavaScript(`
            document.getElementById("input").click();
        `);
        setTimeout(function(){
            let input = winMgr.getWindowsByName("input");
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            input[0].webContents.executeJavaScript(`
                
            `);
        },1000);
    },1000);
},1500);