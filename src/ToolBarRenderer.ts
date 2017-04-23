import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as viewMgr from "./req/renderer/viewMgr";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
        document.getElementById("input").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "input"});
        }
        document.getElementById("QC").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "QC"});
        }
        document.getElementById("align").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "align"});
        }
        document.getElementById("pathogen").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "pathogen"});
        }
        document.getElementById("output").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "output"});
        }
        document.getElementById("circularGenomeBuilder").onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send("openWindow",{refName : "circularGenomeBuilder"});
        }
    }
);