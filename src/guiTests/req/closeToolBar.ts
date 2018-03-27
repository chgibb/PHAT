import * as winMgr from "./../../req/main/winMgr"

/**
 * Triggers close event on the PHAT tool bar
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function closeToolBar() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("closing toolbar");
            setTimeout(function(){  
                let toolBar = winMgr.getWindowsByName("toolBar");
                if(!toolBar || toolBar.length > 1 || toolBar.length == 0)
                {
                    console.log("Failed to open tool bar!");
                    console.log(toolBar);
                }
                toolBar[0].close();
                resolve();
            },2500);
        },2500);
    });
}
