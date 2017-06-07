import * as electron from "electron";
const ipc = electron.ipcRenderer;



const jsonFile = require("jsonfile");
const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {AtomicOperation} from "./req/operations/atomicOperations"
import {AtomicOperationIPC} from "./req/atomicOperationsIPC";
import {GetKeyEvent,KeySubEvent,SaveKeyEvent} from "./req/ipcEvents";

import {ProjectManifest,manifestsPath} from "./req/projectManifest";

import {checkServerPermission} from "./req/checkServerPermission";
import formatByteString from "./req/renderer/formatByteString";

import * as viewMgr from "./req/renderer/viewMgr";

import * as projectsView from "./req/renderer/ProjectSelectionRenderer/projectsView";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

function refreshProjects() : void
{
    jsonFile.readFile(manifestsPath,function(err : string,obj : Array<ProjectManifest>){
        let projectsView = <projectsView.ProjectsView>viewMgr.getViewByName("projectsView");
        projectsView.projects = obj;
        viewMgr.render();
    });
}

$
(
    function()
    {
        /*
            This method is only for internal testing in order to limit access to the application
            to collaborators. This needs to be removed for the public release. token should be
            a GitHub oAuth token.
        */
        dialogs.prompt("Enter Access Token","",function(token : string){
            checkServerPermission(token).then(() => {
                ipc.send(
                    "saveKey",
                    <SaveKeyEvent>{
                        action : "saveKey",
                        channel : "application",
                        key : "auth",
                        val : {token : token}
                    }
                );
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "checkForUpdate"
                    }
                );           
            }).catch((err : string) => {
                let remote = electron.remote;
                remote.app.quit();
            });
        });
        refreshProjects();
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "projectSelection"
            }
        );
        projectsView.addView(viewMgr.views,"projects");
        viewMgr.changeView("projectsView");
        ipc.on
        (
            "projectSelection",function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations" && arg.val !== undefined)
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].name == "openProject")
                            {
                                document.body.innerHTML = `
                                    <h1>Unpacked ${ops[i].extraData.unPacked} of ${ops[i].extraData.toUnpack}</h1>
                                `;
                                return;
                            }
                            if(ops[i].flags.done && ops[i].flags.success && ops[i].name == "checkForUpdate")
                            {
                                dialogs.confirm(
                                    `PHAT ${ops[i].extraData.tag_name} is available. Download and install?`,
                                    `More PHATness`,
                                    (ok : boolean) => {
                                        if(ok)
                                        {
                                            ipc.send(
                                                "runOperation",
                                                    <AtomicOperationIPC>{
                                                        opName : "downloadAndInstallUpdate"
                                                    }
                                            );
                                        }
                                    }
                                );
                            }
                            if(ops[i].name == "downloadAndInstallUpdate" && ops[i].extraData !== undefined)
                            {
                                document.body.innerHTML = `
                                    <h1>Downloaded: ${formatByteString(ops[i].extraData.downloadProgress)}</h1><br />
                                    <h2>PHAT will close itself when the download is complete. Please wait a few minutes before restarting PHAT.</h2>

                                `;
                                return;
                            }
                            if(ops[i].name == "newProject")
                                refreshProjects();
                        }
                        
                    }
                }
            }
        )
    }
);