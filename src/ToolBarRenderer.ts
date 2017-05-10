import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations"
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {checkServerPermission} from "./req/checkServerPermission";

import * as viewMgr from "./req/renderer/viewMgr";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
        /*
            This method is only for internal testing in order to limit access to the application
            to collaborators. This needs to be removed for the public release. token should be
            a GitHub oAuth token.
        */
        /*dialogs.prompt("Enter Access Token","",function(token : string){
            checkServerPermission(token).catch((err : string) => {
                let remote = electron.remote;
                remote.app.quit();
            });
        });*/
        document.getElementById("input").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "input"});
        }
        document.getElementById("QC").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "QC"});
        }
        document.getElementById("align").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "align"});
        }
        document.getElementById("pathogen").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "pathogen"});
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
        ipc.on
        (
            "toolBar",function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations" && arg.val !== undefined)
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].flags.done)
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