import * as winMgr from "./../../../req/main/winMgr"

export async function createNewProject() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let projSelection = winMgr.getWindowsByName("projectSelection");
        setTimeout(function(){
            console.log("creating new project");
            projSelection[0].webContents.executeJavaScript(`
                const electron = require("electron");
                const ipc = electron.ipcRenderer;
                ipc.send(
                    "runOperation",
                    {
                        opName : "newProject",
                        name : "New Project Test"
                    }
                );
            `);
            resolve();
        },500);
    });
}