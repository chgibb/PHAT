import * as winMgr from "./../../../req/main/winMgr";

/**
 * Opens an input window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openInputWindow() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        setTimeout(async function(){
            console.log("opening input window");
            setTimeout(async function(){
                let toolBar = winMgr.getWindowsByName("toolBar");
                await toolBar[0].webContents.executeJavaScript(`
                    document.getElementById("input").click();
                `);
                resolve();
            },1500);
        },1500);
    });
}
