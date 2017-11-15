import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations"
import {KeySubEvent} from "./req/ipcEvents";
import {initializeWindowDock,dockWindow,removeZombieTabs} from "./req/renderer/dock";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";


$
(
    function()
    {
        initializeWindowDock();
        document.getElementById("input").onclick = function(this : HTMLElement,ev : MouseEvent){
            //ipc.send("openWindow",{refName : "input"});
            dockWindow("input","toolBar");
        }
        document.getElementById("QC").onclick = function(this : HTMLElement,ev : MouseEvent){
            //ipc.send("openWindow",{refName : "QC"});
            dockWindow("QC","toolBar");
        }
        document.getElementById("align").onclick = function(this : HTMLElement,ev : MouseEvent){
            //ipc.send("openWindow",{refName : "align"});
            dockWindow("align","toolBar");
        }
        document.getElementById("output").onclick = function(this : HTMLElement,ev : MouseEvent){
            //ipc.send("openWindow",{refName : "output"});
            dockWindow("output","toolBar");
        }
        document.getElementById("circularGenomeBuilder").onclick = function(this : HTMLElement,ev : MouseEvent){
            //ipc.send("openWindow",{refName : "circularGenomeBuilder"});
            dockWindow("circularGenomeBuilder","toolBar");
        }

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
                    if(arg.key == "operations" && arg.val !== undefined && arg.val.length)
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].name == "unDockWindow")
                            {
                                //when undocking has completed, clean up the tab left behind in the dock
                                //We have to do this manually as <webview>s "destroy" event is broken https://github.com/electron/electron/issues/9675
                                if(ops[i].flags.done && ops[i].flags.success)
                                    removeZombieTabs();

                            }
                            if(ops[i].name == "saveCurrentProject")
                            {
                                document.body.innerHTML = `<h1>Saving Project</h1>`;
                            }
                            if(ops[i].flags.done && (ops[i].name == "indexFasta" ||
                                ops[i].name == "runAlignment" || ops[i].name == "saveCurrentProject" ||
                                ops[i].name == "renderCoverageTrackForContig" || ops[i].name == "renderSNPTrackForContig"
                            ))
                            {
                                let notification : Notification = new Notification(ops[i].flags.success ? "Success" : "Failure",<NotificationOptions>{
                                    body : `
                                        ${(()=>{
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
                    }
                }
            }
        );
    }
);