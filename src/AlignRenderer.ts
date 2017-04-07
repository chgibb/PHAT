import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import {makeValidID} from "./req/renderer/MakeValidID";
import * as viewMgr from "./req/renderer/viewMgr";

import * as reportView from "./req/renderer/AlignRenderer/reportView"

import AlignMgr from "./req/renderer/Align";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");
let align = new AlignMgr
(
    'align',
    {
        postStateHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
            viewMgr.render();
        },
        spawnHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
        },
        fsAccess : function(str)
        {
            return str;
        }
    }
);

$
(
    function()
    {
        reportView.addView(viewMgr.views,"container",align);

        viewMgr.changeView("report");
        
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "align"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "align"
            }
        );

        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "align"
            }
        );
        ipc.send(
            "keySub",
            {
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
                            align.aligns = arg.val;
                        }
                    }
                }
                
                viewMgr.render();
            }
        );
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                console.log(JSON.stringify(arg,undefined,4));
                //update from spawned process.
                //forward to handler.
                align.spawnReply("spawnReply",arg);
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