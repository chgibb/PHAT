import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations";
import {KeySubEvent} from "./req/ipcEvents";
import {initializeWindowDock,dockWindow,removeZombieTabs} from "./req/renderer/dock";
import formatByteString from "./req/renderer/formatByteString";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";


$
(
    function()
    {
        initializeWindowDock();
        document.getElementById("input").onclick = function(this : HTMLElement,ev : MouseEvent)
        {
            dockWindow("input","toolBar");
        };
        document.getElementById("QC").onclick = function(this : HTMLElement,ev : MouseEvent)
        {
            dockWindow("QC","toolBar");
        };
        document.getElementById("align").onclick = function(this : HTMLElement,ev : MouseEvent)
        {
            dockWindow("align","toolBar");
        };
        document.getElementById("output").onclick = function(this : HTMLElement,ev : MouseEvent)
        {
            dockWindow("output","toolBar");
        };
        document.getElementById("circularGenomeBuilder").onclick = function(this : HTMLElement,ev : MouseEvent)
        {
            dockWindow("circularGenomeBuilder","toolBar");
        };

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "toolBar"
            }
        );

        ipc.on
        (
            "toolBar",function(event : Electron.IpcMessageEvent,arg : any)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations")
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        let runningOpNotification : HTMLElement = document.getElementById("runningOpNotification");
                        let foundRunning = false;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].running)
                            {
                                foundRunning = true;
                                if(runningOpNotification)
                                {
                                    let text = "";
                                    if(ops[i].progressMessage)
                                    {
                                        text += `${ops[i].progressMessage}`;
                                    }
                                    runningOpNotification.innerHTML = text;
                                }
                            }

                            if(ops[i].name == "unDockWindow")
                            {
                                //when undocking has completed, clean up the tab left behind in the dock
                                //We have to do this manually as <webview>s "destroy" event is broken https://github.com/electron/electron/issues/9675
                                if(ops[i].flags.done && ops[i].flags.success)
                                    removeZombieTabs();

                            }
                            if(ops[i].name == "saveProject")
                            {
                                let savingMessage = `
                                    <h1>Saving Project</h1>
                                `;
                                if(ops[i].extraData !== undefined)
                                {
                                    savingMessage += `
                                        <h3>Saved ${formatByteString(ops[i].extraData.bytesSaved)} of ${formatByteString(ops[i].extraData.totalBytesToSave)}</h3>
                                    `;
                                }
                                document.body.innerHTML = savingMessage;
                            }
                            if(ops[i].flags.done && (ops[i].name == "indexFasta" ||
                                ops[i].name == "runBowtie2Alignment" || ops[i].name == "saveProject" ||
                                ops[i].name == "renderCoverageTrackForContig" || ops[i].name == "renderSNPTrackForContig"
                            ))
                            {
                                let notification : Notification = new Notification(ops[i].flags.success ? "Success" : "Failure",<NotificationOptions>{
                                    body : `
                                        ${(()=>
                                    {
                                        if(ops[i].flags.success)
                                        {
                                            return `
                                                    ${ops[i].name} has completed successfully
                                                `;
                                        }
                                        else
                                        {
                                            return `
                                                    ${ops[i].name} has failed
                                                    ${JSON.stringify(ops[i].extraData)}
                                                `;
                                        }
                                    })()}
                                    `
                                });
                            }
                        }
                        if(!foundRunning)
                        {
                            if(runningOpNotification)
                            {
                                runningOpNotification.innerHTML = "";
                            }
                        }
                    }
                }
            }
        );
    }
);