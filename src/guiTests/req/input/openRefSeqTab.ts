import * as winMgr from "./../../../req/main/winMgr";

/**
 * Switches to the ref seq tab in the first input window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openRefSeqTab() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("Trying to open ref seq tab");
            let input = winMgr.getFreeWebContents();
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            input[0].executeJavaScript(`
                document.getElementsByClassName("refSeqViewButton")[0].click();
            `);
            resolve();
        },500);
    });
}