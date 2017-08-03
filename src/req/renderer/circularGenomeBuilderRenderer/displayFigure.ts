import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as cf from "./../circularFigure";
import * as svgCache from "./SVGCache";
//import * as tc from "./templateCache";
import * as plasmid from "./../circularGenome/plasmid";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";

import {getReadable} from "./../../getAppPath";

export async function displayFigure(self : GenomeView) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        svgCache.refreshCache(self.genome);
        if(svgCache.cachesWereReset)
        {
            document.getElementById(self.div).innerHTML = "";
        }
        if(svgCache.baseFigureSVGCache.isDirty)
        {
            console.log("base figure is dirty");
            if(!svgCache.baseFigureSVGCache.clean() && !svgCache.baseFigureSVGCache.buildingSVG)
            {
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "compileTemplates",
                        figure : self.genome,
                        compileBase : true
                    }
                );
                console.log("triggered basefigure recompilation");
                svgCache.baseFigureSVGCache.buildingSVG = true;
                return resolve();
            }
        }
        if(!document.getElementById("baseFigure") && !svgCache.baseFigureSVGCache.isDirty)
        {
            console.log("base figure div not found");
            console.log("injected base figure");
            document.getElementById(self.div).innerHTML += `<div id="baseFigure"></div>`;
            document.getElementById("baseFigure").innerHTML = svgCache.baseFigureSVGCache.svg;
        }
        return resolve();
    });
}