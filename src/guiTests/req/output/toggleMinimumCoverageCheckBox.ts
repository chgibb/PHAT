import * as winMgr from "./../../../req/main/winMgr";

/**
 * Toggles the Minimum Coverage checkbox in the first output window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function toggleMinimumCoverageCheckBox() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("toggling minimum coverage checkbox");
            let output = winMgr.getFreeWebContents();
            if(!output || output.length == 0)
            {
                console.log("failed to open output window");
                process.exit(1);
            }
            output[0].executeJavaScript(`
                document.getElementById("minimumCoverage").click();
            `);
            resolve();
        },500);
    });
}