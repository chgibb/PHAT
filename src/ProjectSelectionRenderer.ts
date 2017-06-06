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
        ipc.on
        (
            "projectSelection",function(event,arg)
            {}
        )
    }
);