import * as winMgr from "./../../../req/main/winMgr";
import { setTimeout } from "timers";

export async function openOutputWindow() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening output window");
            setTimeout(function(){
                let toolBar = winMgr.getWindowsByName("toolBar");
                toolBar[0].webContents.executeJavaScript(`
                document.getElementById("output").click();
                `);
                resolve();
            },500);
        },500);
    });
}