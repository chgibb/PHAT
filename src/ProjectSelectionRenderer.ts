import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperation} from "./req/operations/atomicOperations"
import {AtomicOperationIPC} from "./req/atomicOperationsIPC";
import {GetKeyEvent,KeySubEvent,SaveKeyEvent} from "./req/ipcEvents";

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {checkServerPermission} from "./req/checkServerPermission";
import formatByteString from "./req/renderer/formatByteString";

import * as viewMgr from "./req/renderer/viewMgr";

import * as projectsView from "./req/renderer/ProjectSelectionRenderer/projectsView";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "projectSelection"
            }
        );
        projectsView.addView(viewMgr.views,"projects");
        viewMgr.changeView("projectsView");
        ipc.on
        (
            "projectSelection",function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations" && arg.val !== undefined)
                    {
                    }
                }
            }
        )
    }
);