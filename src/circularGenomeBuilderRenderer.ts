import {ipcRenderer} from "electron";
let ipc = ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";
import * as masterView from "./req/renderer/circularGenomeBuilderRenderer/masterView";
import {CircularGenomeMgr} from "./req/renderer/circularGenomeMgr";
import {SpawnRequestParams} from "./req/JobIPC";
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

require("./req/renderer/commonBehaviour");

import * as $ from "jquery";
(<any>window).$ = $;
let circularGenomeMgr = new CircularGenomeMgr
(
    'circularGenomeBuilder',
    {
        postStateHandle : function(channel : string,arg : any) : void
        {
            ipc.send(channel,arg);
        },
        spawnHandle : function(channel,arg : SpawnRequestParams) : void
        {
            ipc.send(channel,arg);
        },
        fsAccess : function(str : string) : string
        {
            return str;
        }
    }
);
$
(
    function()
    {
        masterView.addView(viewMgr.views,"view",circularGenomeMgr);
        viewMgr.changeView("masterView");
        viewMgr.render();
        //ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "circularGenomeBuilder"});
        //ipc.send('input',{replyChannel : 'circularGenomeBuilder', action : 'getState', key : 'fastaInputs'});
        //ipc.send('keySub',{action : "keySub", channel : "circularGenomeBuilder", key : "managedFastas", replyChannel : "circularGenomeBuilder"});
        //ipc.send("circularGenomeBuilder",{replyChannel : "circularGenomeBuilder", action : "getState", key : "managedFastas"});

        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "input",
                key : "fastaInputs",
                replyChannel : "circularGenomeBuilder",
                action : "getKey"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "circularGenomeBuilder",
                key : "managedFastas",
                replyChannel : "circularGenomeBuilder",
                action : "getKey"
            }
        );

        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "input",
                key : "fastaInputs",
                replyChannel : "circularGenomeBuilder",
                action : "keySub"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "circularGenomeBuilder",
                key : "managedFastas",
                replyChannel : "circularGenomeBuilder",
                action : "keySub"
            }
        );
        ipc.on
        (
            'circularGenomeBuilder',function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            let ref = <masterView.View>viewMgr.getViewByName("masterView");
                            ref.fastaInputs = arg.val;
                            viewMgr.getViewByName("masterView").dataChanged();
                        }
                    }
                    if(arg.key == "managedFastas")
                    {
                        if(arg.val !== undefined)
                        {
                            circularGenomeMgr.managedFastas = arg.val;
                            viewMgr.getViewByName("masterView").dataChanged();
                        }
                    }
                }
                viewMgr.render();
            }
        );
    }
);
