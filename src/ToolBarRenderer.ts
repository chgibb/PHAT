import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations"
import {KeySubEvent,GetKeyEvent} from "./req/ipcEvents";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {

        
        document.getElementById("input").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "input"});
        }
        document.getElementById("QC").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "QC"});
        }
        document.getElementById("align").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "align"});
        }
        document.getElementById("output").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "output"});
        }
        document.getElementById("circularGenomeBuilder").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "circularGenomeBuilder"});
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

        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "application",
                key : "operations",
                replyChannel : "toolBar"
            }
        );

        ipc.on
        (
            "toolBar",function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations" && arg.val !== undefined && arg.val.length)
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].name == "saveCurrentProject")
                            {
                                document.body.innerHTML = `<h1>Saving Project</h1>`;
                            }
                            if(ops[i].flags.done && ops[i].name != "checkForUpdate")
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