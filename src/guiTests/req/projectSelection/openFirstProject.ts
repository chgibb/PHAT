import * as electron from "electron";
const ipc = electron.ipcMain;

import * as winMgr from "./../../../req/main/winMgr"

/**
 * Opens the currently open project from the GUI of the projectSelection window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openFirstProject() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
            setImmediate(function(){
                setTimeout(function(){
                    resolve();
                },10000);
            });

            console.log("opening first project");
            let projSelection = winMgr.getWindowsByName("projectSelection");
            projSelection[0].webContents.executeJavaScript(`
                let els = document.getElementsByClassName("activeHover");
                let isOpenLink = /Open/;
                for(let i = 0; i != els.length; ++i)
                {
                    if(isOpenLink.test(els[i].id))
                    {
                        els[i].click();
                        break;
                    }
                }
            `);
    });
}