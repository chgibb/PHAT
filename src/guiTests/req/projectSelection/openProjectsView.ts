import * as winMgr from "./../../../req/main/winMgr"

/**
 * Switches to the openProject view in the projectSelection window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openProjectsView() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening projects view");
            let projSelection = winMgr.getWindowsByName("projectSelection");
            projSelection[0].webContents.executeJavaScript(`
                document.getElementById("openProject").click();
            `);
            setTimeout(function(){
                resolve();
            },3000);
        },500);
    });
}