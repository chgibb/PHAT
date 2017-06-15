import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {showPileup} from "./req/renderer/PileupRenderer/showPileup"

require("./req/renderer/commonBehaviour");

const pileup = require("./../forDist/pileup");
(<any>window).pileup = pileup;

ipc.on(
    'pileup',
    function(event,arg){
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

window.addEventListener('resize',function(){
    document.getElementById("view").style.height = window.innerHeight+"px";
}, false);
