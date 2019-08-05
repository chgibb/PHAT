import * as winMgr from "./../../../req/main/winMgr";

/**
 * Toggle the available figures dropdown in the first genome builder
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function toggleFiguresDropdown() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("toggling figures dropdown");
            let genomeBuilder = winMgr.getFreeWebContents();
           
            if(!genomeBuilder || genomeBuilder.length == 0)
            {
                console.log("Failed to open genomeBuilder window");
                process.exit(1);
            }

            genomeBuilder[0].executeJavaScript(`
               document.getElementById("figuresDropdownToggle").click();
           `);
            resolve();
        },500); 
    });
}