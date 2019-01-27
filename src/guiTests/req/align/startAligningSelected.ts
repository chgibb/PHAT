import * as winMgr from "./../../../req/main/winMgr";

/**
 * Triggers alignment in the first align window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function startAligningSelected() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        setTimeout(async function(){
            console.log("starting to align selected reads against selected ref seq");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }
            await align[0].executeJavaScript(`
                document.getElementById("alignButton").click();
            `);
            resolve();
        },1000);
    });
}