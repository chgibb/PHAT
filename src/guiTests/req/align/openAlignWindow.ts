import * as winMgr from "./../../../req/main/winMgr";
import { setTimeout } from "timers";

export async function openAlignWindow() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening align window");
            setTimeout(function(){
                let toolBar = winMgr.getWindowsByName("toolBar");
                toolBar[0].webContents.executeJavaScript(`
                    document.getElementById("align").click();
                `);
                resolve();
            },500);
        },500);
    });
}