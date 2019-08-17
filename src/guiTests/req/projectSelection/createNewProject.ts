import * as winMgr from "./../../../req/main/winMgr";
/**
 * Sends an ipc message from the projectSelection window to create a new project
 * named "New Project Test"
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function createNewProject() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("creating new project");
            let projSelection = winMgr.getWindowsByName("projectSelection");
            projSelection[0].webContents.executeJavaScript(`
                const electron = require("electron");
                const ipc = electron.ipcRenderer;
                ipc.send(
                    "runOperation",
                    {
                        opName : "newProject",
                        projName : "New Project Test"
                    }
                );
            `);
            setTimeout(function()
            {
                resolve();
            },5000);
        },500);
    });
}