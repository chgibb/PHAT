import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";
import {makeWindowDockable} from "./req/renderer/dock";
import * as reportView from "./req/renderer/AlignRenderer/reportView"

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";
import {AtomicOperation} from "./req/operations/atomicOperations";

$
(
    function()
    {
        makeWindowDockable("align");
        reportView.addView(viewMgr.views,"container");

        viewMgr.changeView("report");
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "application",
                key : "operations",
                replyChannel : "align"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "align"
            }
        );

        ipc.on
        (
            'align',function(event : Electron.IpcMessageEvent,arg : any)
            {
                console.log(arg);
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            (<reportView.ReportView>viewMgr.getViewByName("report")).fastqInputs = arg.val;
                        }
                    }
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            (<reportView.ReportView>viewMgr.getViewByName("report")).fastaInputs = arg.val;
                        }
                    }
                    let found = false;
                    if(arg.key == "operations")
                    {
                        if(arg.val !== undefined)
                        {
                            let ops : Array<AtomicOperation> = arg.val;
                            try
                            {
                                for(let i = 0; i != ops.length; ++i)
                                {
                                    if(ops[i].name == "runAlignment")
                                    {
                                        (<reportView.ReportView>viewMgr.getViewByName("report")).shouldAllowTriggeringOps = false;
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            catch(err){}
                        }
                    }
                    if(!found)
                        (<reportView.ReportView>viewMgr.getViewByName("report")).shouldAllowTriggeringOps = true;
                }
                viewMgr.render();
            }
        );
    }
);
$(window).resize
(
	function()
	{
        viewMgr.render();
    }
);