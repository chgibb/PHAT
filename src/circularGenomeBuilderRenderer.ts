import {ipcRenderer} from "electron";
let ipc = ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";
import * as addMasterView from "./req/renderer/circularGenomeBuilderRenderer/masterView";
import {CircularGenomeMgr} from "./req/renderer/circularGenomeMgr";
import {SpawnRequestParams} from "./req/JobIPC";
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
        addMasterView.addView(viewMgr.views,"view",circularGenomeMgr);
        viewMgr.changeView("masterView");
        viewMgr.render();
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "circularGenomeBuilder"});
        ipc.send('input',{replyChannel : 'circularGenomeBuilder', action : 'getState', key : 'fastaInputs'});
        ipc.send('keySub',{action : "keySub", channel : "circularGenomeBuilder", key : "managedFastas", replyChannel : "circularGenomeBuilder"});
        ipc.send("circularGenomeBuilder",{replyChannel : "circularGenomeBuilder", action : "getState", key : "managedFastas"});
        ipc.on
        (
            'circularGenomeBuilder',function(event,arg)
            {
                if(arg.action == "getState" || arg.action == "keyChange")
                {
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val != 0)
                        {
                            let ref = <any>viewMgr.getViewByName("masterView");
                            ref.fastaInputs = arg.val;
                            viewMgr.getViewByName("masterView").dataChanged();
                        }
                    }
                    if(arg.key == "managedFastas")
                    {
                        if(arg.val != 0)
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
