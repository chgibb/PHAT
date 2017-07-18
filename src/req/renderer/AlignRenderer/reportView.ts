/// <reference types="jquery" />
import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import Fastq from "./../../fastq";
import {Fasta} from "./../../fasta";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
export class ReportView extends viewMgr.View
{
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;

    public constructor(div : string)
    {
        super('report',div);
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public dataChanged() : void{}
    public renderView() : string | undefined
    {
        return `
        <div class="outerCenteredDiv">
            <div class="innerCenteredDiv">
            <div id="reads" style="display:inline-block;width:45%;float:left;">
            ${(()=>{
                let res = "";
                res += `
                    <table style="width:100%">
                        <tr>
                            <th>Reads</th>
                        </tr>
                `;
                for(let i = 0; i != this.fastqInputs.length; ++i)
                {
                    res += `
                        <tr>
                            <td>${this.fastqInputs[i].alias}</td>
                        </tr>
                    `;
                }
                res += `</table>`;
                return res;
            })()}
            </div>
            <div id="refSeqs" style="display:inline-block;width:45%;">
            ${(()=>{
                let res = "";
                res += `
                    <table style="width:100%">
                        <tr>
                            <th>Ref Seqs</th>
                        </tr>
                `;
                for(let i = 0; i != this.fastaInputs.length; ++i)
                {
                    res += `
                        <tr>
                            <td>${this.fastaInputs[i].alias}</td>
                        </tr>
                    `;
                }
                res += `</table>`;
                return res;
            })()}
            </div>
            </div>
        </div>
        `;
    }
    public postRender() : void
    {

    }
    public divClickEvents(event : JQueryEventObject) : void
    {

    }

}

export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new ReportView(div));
}