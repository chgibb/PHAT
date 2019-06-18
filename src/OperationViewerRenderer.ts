import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations";
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";
import * as masterView from "./req/renderer/OperationViewerRenderer/masterView";
import * as runningView from "./req/renderer/OperationViewerRenderer/runningView";
import * as logView from "./req/renderer/OperationViewerRenderer/logView";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";

function postRender(view : viewMgr.View) : void
{
    $("#logView").css("height",$(window).height()/2+"px");
    $("#runningView").css("height",$(window).height()/2+"px");
}
viewMgr.setPostRender(postRender);

let pingOperations = setInterval(function()
{
    console.log("running ping");
    ipc.send(
        "getKey",
        <GetKeyEvent>{
            action : "getKey",
            channel : "application",
            key : "operations",
            replyChannel : "operationViewer"
        }
    );
    console.log("done running ping");
},3000);
window.addEventListener("unload",function()
{
    clearInterval(pingOperations);
});
$(
    function()
    {
        console.log("adding views");
        masterView.addView(viewMgr.views,"masterView");
        viewMgr.changeView("masterView");
        console.log("done adding views");
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "application",
                key : "operations",
                replyChannel : "operationViewer"
            }
        );
        ipc.on(
            "operationViewer",function(event : Electron.IpcMessageEvent,arg : any)
            {
                if(arg.action == "getKey")
                {
                    console.log("getkey");
                    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                    let logView = <logView.View>viewMgr.getViewByName("logView",masterView.views);
                    let runningView = <runningView.View>viewMgr.getViewByName("runningView",masterView.views);
                    logView.dataChanged();
                    runningView.ops = null;
                    if(arg.key == "operations" && arg.val !== undefined && Array.isArray(arg.val))
                    {
                        runningView.ops = new Array<AtomicOperation>();
                        runningView.ops = runningView.ops.concat(arg.val);
                    }
                    viewMgr.render();
                }
            }
        );
        viewMgr.render();
    }
);