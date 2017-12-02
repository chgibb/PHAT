import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";
import {makeWindowDockable} from "./req/renderer/dock";
import * as reportView from "./req/renderer/AlignRenderer/reportView"

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";

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
                    if(arg.key == "operations")
                    {
                        (<reportView.ReportView>viewMgr.getViewByName("report")).operations = arg.val;
                    }
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