import * as electron from "electron";
const ipc = electron.ipcRenderer;
const remote = electron.remote;

import {ProjectManifest,getProjectManifests} from "./req/projectManifest";
import {AtomicOperation} from "./req/operations/atomicOperations";
import {AtomicOperationIPC} from "./req/atomicOperationsIPC";
import {KeySubEvent,SaveKeyEvent} from "./req/ipcEvents";
import formatByteString from "./req/renderer/formatByteString";
import * as viewMgr from "./req/renderer/viewMgr";
import * as splashView from "./req/renderer/ProjectSelectionRenderer/splashView";
import * as openProjectView from "./req/renderer/ProjectSelectionRenderer/openProjectView";
import * as helpView from "./req/renderer/ProjectSelectionRenderer/helpView";

const Dialogs = require("dialogs");
const jsonFile = require("jsonfile");
const $ = require("jquery");

import "./req/renderer/commonBehaviour";
import {enQueueOperation} from "./req/renderer/enQueueOperation";

(<any>window).$ = $;
const dialogs = Dialogs();

$(
    function()
    {
        document.body.innerHTML += `
            <br />
            <a id="citeLink" style="color:black;" class="activeHover">Gibb et al., 2018 (Bioinformatics)</a>
        `;
        enQueueOperation({
            opName:"checkForUpdate",
        });

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "projectSelection"
            }
        );
        splashView.addView(viewMgr.views,"view");
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
                        let ops : Array<AtomicOperation<any>> = <Array<AtomicOperation<any>>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].opName == "openProject" && ops[i].extraData !== undefined)
                            {
                                document.body.innerHTML = `
                                    <h1>Unpacked ${ops[i].extraData.unPacked} of ${ops[i].extraData.toUnpack}</h1>
                                `;
                                return;
                            }
                            if(ops[i].flags.done && ops[i].flags.success && ops[i].opName == "checkForUpdate")
                            {
                                dialogs.confirm(
                                    `PHAT ${ops[i].extraData.tag_name} is available. Download and install?`,
                                    "More PHATness",
                                    (ok : boolean) => 
                                    {
                                        if(ok)
                                        {
                                            enQueueOperation({opName : "downloadAndInstallUpdate",data:{asset:{}}});
                                        }
                                    }
                                );
                            }
                            if(ops[i].opName == "downloadAndInstallUpdate" && ops[i].extraData !== undefined)
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
        document.getElementById("citeLink")!.onclick = function(this : GlobalEventHandlers,ev : MouseEvent)
        {
            remote.shell.openExternal("https://doi.org/10.1093/bioinformatics/bty1003");
        };
    }
);