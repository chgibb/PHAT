import * as electron from "electron";
const ipc = electron.ipcRenderer;

const jsonFile = require("jsonfile");
const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {ProjectManifest,getProjectManifests} from "./req/projectManifest";

import {AtomicOperation} from "./req/operations/atomicOperations"
import {AtomicOperationIPC} from "./req/atomicOperationsIPC";
import {KeySubEvent,SaveKeyEvent} from "./req/ipcEvents";
import formatByteString from "./req/renderer/formatByteString";

import * as viewMgr from "./req/renderer/viewMgr";

import * as splashView from "./req/renderer/ProjectSelectionRenderer/splashView";
import * as openProjectView from "./req/renderer/ProjectSelectionRenderer/openProjectView";
import * as helpView from "./req/renderer/ProjectSelectionRenderer/helpView";

import {citationText} from "./req/renderer/citationText";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
        document.body.innerHTML += `
            <br />
            <p>${citationText}</p>
        `;
        ipc.send(
            "runOperation",
            <AtomicOperationIPC>{
                opName : "checkForUpdate"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "projectSelection"
            }
        );
        splashView.addView(viewMgr.views,"view")
        openProjectView.addView(viewMgr.views,"view");
        helpView.addView(viewMgr.views,"view");
        viewMgr.changeView("splashView");
        ipc.on
        (
            "projectSelection",function(event : Electron.IpcMessageEvent,arg : any)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations" && arg.val !== undefined)
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].name == "openProject" && ops[i].extraData !== undefined)
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
                        }
                        
                    }
                }
            }
        );
        
    }
);