import * as winMgr from "./../../../req/main/winMgr";

/**
 * Opens an align window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openAlignWindow() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        setTimeout(async function()
        {
            console.log("opening align window");
            setTimeout(async function()
            {
                let toolBar = winMgr.getWindowsByName("toolBar");
                await toolBar[0].webContents.executeJavaScript(`
                    document.getElementById("align").click();
                `);
                setTimeout(async function()
                {
                    resolve();
                },1000);
            },1000);
        },1000);
    });
}