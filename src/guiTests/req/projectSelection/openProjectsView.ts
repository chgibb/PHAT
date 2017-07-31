import * as winMgr from "./../../../req/main/winMgr"

export async function openProjectsView() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening projects view");
            let projSelection = winMgr.getWindowsByName("projectSelection");
            projSelection[0].webContents.executeJavaScript(`
                document.getElementById("openProject").click();
            `);
            setTimeout(function(){
                resolve();
            },3000);
        },500);
    });
}