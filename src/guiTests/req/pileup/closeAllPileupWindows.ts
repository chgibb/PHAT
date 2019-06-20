import * as winMgr from "./../../../req/main/winMgr";

/**
 * Closes all currently open pileup windows, crashes the process
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function closeAllPileupWindows() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            let viewers = winMgr.getWindowsByName("pileup");
            if(!viewers || viewers.length == 0)
            {
                console.log("failed to open any pileup viewers");
                process.exit(1);
            }
            for(let i = 0; i != viewers.length; ++i)
            {
                viewers[i].close();
            }
            resolve();
        },500);
    });
}