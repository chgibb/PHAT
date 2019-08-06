import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {showPileup} from "./req/renderer/PileupRenderer/showPileup";

import "./req/renderer/commonBehaviour";

const pileup = require("./../forDist/pileup");
(<any>window).pileup = pileup;

ipc.on(
    "pileup",
    function(event : Electron.IpcMessageEvent,arg : any)
    {
        showPileup(
            arg.align,
            arg.contig,
            arg.start,
            arg.stop,
            "view",
            pileup
        );
    }
);   

window.addEventListener("resize",function()
{
    document.getElementById("view").style.height = window.innerHeight+"px";
}, false);
