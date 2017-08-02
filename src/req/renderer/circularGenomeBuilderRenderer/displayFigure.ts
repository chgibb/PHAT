import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as cf from "./../circularFigure";
import * as tc from "./templateCache";
import * as plasmid from "./../circularGenome/plasmid";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";

import {getReadable} from "./../../getAppPath";

export async function displayFigure(self : GenomeView) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        tc.refreshCache(self.genome);
        if(tc.cachesWereReset)
        {
           /* let templates = cf.assembleCompilableBaseFigureTemplates(self.genome);
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "compileTemplates",
                    templates : templates,
                    figure : self.genome
                }
            );
            for(let i = 0; i != self.genome.renderedCoverageTracks.length; ++i)
            {
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "compileTemplates",
                        templates : cf.assembleCompilableCoverageTrack(self.genome,self.genome.renderedCoverageTracks[i]),
                        figure : self.genome
                    }
                );
            }*/
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "compileTemplates",
                    figure : self.genome,
                    compileBase : true
                }
            );
           /* let $div : any;
            $div = $(`${cf.assembleCompilableCoverageTrack(self.genome,self.genome.renderedCoverageTracks[0])}`);
            $(document.body).append($div);
            console.log("appended div");

            document.getElementById("loadingText").innerText = "Compiling templates...";
            console.log("set loading 2");

            angular.element(document).injector().invoke(function($compile : any){
                //This should probably be done with an actual angular scope instead 
                //of mutating the existing scope
                let scope = angular.element($div).scope();
                self.updateScope(scope);
                $compile($div)(scope);
                console.log("finished compiling");
            });*/
        }
    });
}