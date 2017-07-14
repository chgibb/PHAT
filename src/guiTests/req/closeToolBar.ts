import * as winMgr from "./../../req/main/winMgr"

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
                    process.exit(1);
                }
                toolBar[0].close();
                resolve();
            },5000);
        },5000);
    });
}