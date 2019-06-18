import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./req/renderer/viewMgr";
import {GetKeyEvent} from "./req/ipcEvents";
import {PIDInfo} from "./req/PIDInfo";
import {getPIDInfo,getPIDUsage} from "./req/getPIDInfo";
import * as masterView from "./req/renderer/procMgr/masterView";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";

let pingPIDs : NodeJS.Timer = setInterval(function()
{
    ipc.send(
        "getAllPIDs",
        <GetKeyEvent>{
            action : "getKey",
            replyChannel : "procMgr"
        }
    );
},1000);

$(
    function()
    {
        masterView.addView(viewMgr.views,"view");
        viewMgr.changeView("masterView");
        viewMgr.render();
        viewMgr.render();
        ipc.on(
            "procMgr",async function(event : Electron.IpcMessageEvent,arg : any)
            {
                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                if(arg.key == "pids")
                {
                    let pids : Array<PIDInfo> = arg.val;
                    for(let i = 0; i != pids.length; ++i)
                    {
                        try
                        {
                            let use = await getPIDUsage(pids[i].pid);
                            pids[i].cpu = use.cpu;
                            pids[i].memory = use.memory;
                        }
                        catch(err)
                        {
                            err;
                        }
                        if(!pids[i].isPHAT)
                        {
                            try
                            {
                                let info = await getPIDInfo(pids[i].pid);
                                pids[i].ppid = info[0].ppid;
                                pids[i].command = info[0].command;
                                pids[i].arguments = info[0].arguments;
                            }
                            catch(err)
                            {}
                        }
                    }
                    //console.log(pids);
                    masterView.pids = pids;
                    masterView.dataChanged();
                    viewMgr.render();
                }
            }
        );
    }
);