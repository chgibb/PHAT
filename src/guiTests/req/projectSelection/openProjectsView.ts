import * as winMgr from "./../../../req/main/winMgr"

export async function openProjectsView() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let projSelection = winMgr.getWindowsByName("projectSelection");
        setTimeout(function(){
            projSelection[0].webContents.executeJavaScript(`
                document.getElementById("openProject").click();
            `);
            resolve();
        },500);
    });
}