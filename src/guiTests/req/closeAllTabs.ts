import * as winMgr from "./../../req/main/winMgr";

/**
 * Closes all tabs docked in the tool bar
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function closeAllTabs() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("closing all tabs");
            let toolBar = winMgr.getWindowsByName("toolBar");
            if(!toolBar || toolBar.length > 1 || toolBar.length == 0)
            {
                console.log("Failed to open tool bar!");
                process.exit(1);
            }
            toolBar[0].webContents.executeJavaScript(`
                (function(){
                    let closeButtons = document.getElementsByClassName("etabs-tab-button-close");
                    while(closeButtons.length > 0)
                    {
                        closeButtons[closeButtons.length-1].click();
                    }
                })();
            `);
            resolve();
        },500);
    });
}