import * as winMgr from "./../../../req/main/winMgr";

/**
 * Opens a circularGenomeBuilder window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openCircularGenomeBuilderWindow() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening circularGenomeBuilder window");
            setTimeout(function(){
                let toolBar = winMgr.getWindowsByName("toolBar");
                toolBar[0].webContents.executeJavaScript(`
                    document.getElementById("circularGenomeBuilder").click();
                `);
                setTimeout(function(){
                    resolve();
                },1500);
            },500);
        },500);
    });
}