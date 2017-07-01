import * as winMgr from "./../../../req/main/winMgr";

export async function openInputWindow() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            let toolBar = winMgr.getWindowsByName("toolBar");
            toolBar[0].webContents.executeJavaScript(`
                document.getElementById("input").click();
            `);
            resolve();
        },500);
    });
}