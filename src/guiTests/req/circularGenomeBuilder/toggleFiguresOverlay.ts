import * as winMgr from "./../../../req/main/winMgr";

/**
 * Toggle the available figures dropdown in the first genome builder
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function toggleFiguresOverlay() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("toggling figures overlay");
            let genomeBuilder = winMgr.getFreeWebContents();
           
            if(!genomeBuilder || genomeBuilder.length == 0)
            {
                console.log("Failed to open genomeBuilder window");
                process.exit(1);
            }

            genomeBuilder[0].executeJavaScript(`
               document.getElementById("figuresOverlayToggle").click();
           `);
            resolve();
        },500); 
    });
}