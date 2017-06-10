import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";
import * as reportView from "./req/renderer/AlignRenderer/reportView"

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
        reportView.addView(viewMgr.views,"container");

        viewMgr.changeView("report");
        
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "align"
            }
        );
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
                channel : "align",
                key : "aligns",
                replyChannel : "align"
            }
        );
        

        ipc.on
        (
            'align',function(event,arg)
            {
                console.log(arg);
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            //views[view.getIndexOfViewByName(views,"report")].data.fastqInputs = arg.val;
                            (<reportView.ReportView>viewMgr.getViewByName("report")).fastqInputs = arg.val;
                        }
                    }
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            //views[view.getIndexOfViewByName(views,"report")].data.fastaInputs = arg.val;
                            (<reportView.ReportView>viewMgr.getViewByName("report")).fastaInputs = arg.val;
                        }
                    }
                    if(arg.key == "aligns")
                    {
                        if(arg.val !== undefined)
                        {
                            
                        }
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