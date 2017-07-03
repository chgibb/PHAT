import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations"
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";

import * as masterView from "./req/renderer/OperationViewerRenderer/masterView";
import * as runningView from "./req/renderer/OperationViewerRenderer/runningView";
import * as logView from "./req/renderer/OperationViewerRenderer/logView";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

function postRender(view : viewMgr.View) : void
{
    $("#logView").css("height",$(window).height()/2+"px");
    $("#runningView").css("height",$(window).height()/2+"px");
}
viewMgr.setPostRender(postRender);
$
(
    function()
    {
        masterView.addView(viewMgr.views,"");
        viewMgr.changeView("masterView");
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "operationViewer"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "application",
                key : "operations",
                replyChannel : "operationViewer"
            }
        );
        setInterval(function(){
            ipc.send(
                "getKey",
                <GetKeyEvent>{
                    action : "getKey",
                    channel : "application",
                    key : "operations",
                    replyChannel : "operationViewer"
                }
            );
        },500);
        ipc.on
        (
            "operationViewer",function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    let res = ``;
                    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                    let logView = <logView.View>viewMgr.getViewByName("logView",masterView.views);
                    let runningView = <runningView.View>viewMgr.getViewByName("runningView",masterView.views);
                    logView.dataChanged();
                    runningView.ops = new Array<AtomicOperation>();
                    if(arg.key == "operations" && arg.val !== undefined)
                    {
                        
                        runningView.ops = <Array<AtomicOperation>>arg.val;
                        
                        /*
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            try
                            {
                                if(!ops[i].running)
                                {
                                    res += `<p>${ops[i].name}: Queued</p><br />`;
                                }
                                if(ops[i].running)
                                {
                                    res += `<p>${ops[i].name}: Running</p><br />

                                        ${(()=>{
                                            if(ops[i].progressMessage)
                                            {
                                                return `<p>${ops[i].progressMessage}</p><br />`;
                                            }
                                            else
                                            {
                                                return "";
                                            }
                                        })()}
                                    `;
                                }
                            }
                            catch(err){}
                        }
                        document.getElementById("view").innerHTML = res;
                        */
                    }
                    viewMgr.render();
                }
            }
        )
    }
);