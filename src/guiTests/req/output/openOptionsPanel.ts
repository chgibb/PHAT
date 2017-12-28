import * as winMgr from "./../../../req/main/winMgr";

/**
 * Opens the options slide out panel in the first output window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openOptionsPanel() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening options panel");
            let output = winMgr.getFreeWebContents();
            if(!output || output.length == 0)
            {
                console.log("failed to open output window");
                process.exit(1);
            }
            output[0].executeJavaScript(`
                document.getElementById("rightPanel").click();
            `);
            resolve();
        },500);
    });
}