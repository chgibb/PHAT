import * as winMgr from "./../../../req/main/winMgr";

export async function indexRefs() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("indexing ref seqs");
            let input = winMgr.getWindowsByName("input");
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            input[0].webContents.executeJavaScript(`
                document.getElementById("indexButton").click();
            `);
            resolve();
        },500);
    });
}