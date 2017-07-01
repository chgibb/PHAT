import * as winMgr from "./../../../req/main/winMgr";

export async function selectAllRefs() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            let input = winMgr.getWindowsByName("input");
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            input[0].webContents.executeJavaScript(`
                let isHost = /_host/;
                let isImport = /Import/;

                let tds = document.getElementsByTagName("input");
                for(let i = 0; i != tds.length; ++i)
                {
                    if(tds[i].id && !isHost.test(tds[i].id) && !isImport.test(tds[i].id))
                    {
                        tds[i].click();
                    }
                }
            `);
            resolve();
        },500);
    });
}