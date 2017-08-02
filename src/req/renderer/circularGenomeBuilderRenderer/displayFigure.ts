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
            let templates = cf.assembleCompilableBaseFigureTemplates(self.genome);
            console.log(templates);
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "compileTemplates",
                    templates : templates,
                    figure : self.genome
                }
            );
        }
    });
}