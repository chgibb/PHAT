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
    public fastq1uuid : string;
    public fastq2uuid : string;
    public fastauuid : string;
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
                    if(!this.fastqInputs[i].checked)
                        continue;
                    res += `<tr>`;
                    if(this.fastqInputs[i].uuid == this.fastq1uuid)
                    {
                        res += `<td class="activeHover selected" id="${this.fastqInputs[i].uuid}">${this.fastqInputs[i].alias} <b style="float:right;">1</b></td>`;
                    }
                    else if(this.fastqInputs[i].uuid == this.fastq2uuid)
                    {
                        res += `<td class="activeHover selected" id="${this.fastqInputs[i].uuid}">${this.fastqInputs[i].alias} <b style="float:right;">2</b></td>`;
                    }
                    else
                        res += `<td class="activeHover" id="${this.fastqInputs[i].uuid}">${this.fastqInputs[i].alias}</td>`;
                    res += `</tr>`;
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
                    if(!this.fastaInputs[i].indexed || !this.fastaInputs[i].checked)
                        continue;
                    res += `<tr>`;
                    if(this.fastaInputs[i].uuid == this.fastauuid)
                    {
                        res += `<td class="activeHover selected" id="${this.fastaInputs[i].uuid}">${this.fastaInputs[i].alias} <b style="float:right;">*</b></td>`;
                    }
                    else
                        res += `<td class="activeHover" id="${this.fastaInputs[i].uuid}">${this.fastaInputs[i].alias}</td>`;
                    res += `</tr>`;
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
        if(event.target.id == this.fastq1uuid)
        {
            this.fastq1uuid = undefined;
            viewMgr.render();
            return;
        }
        else if(event.target.id == this.fastq2uuid)
        {
            this.fastq2uuid = undefined;
            viewMgr.render();
            return;
        }
        else if(event.target.id == this.fastauuid)
        {
            this.fastauuid = undefined;
            viewMgr.render();
            return;
        }
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            if(event.target.id == this.fastqInputs[i].uuid)
            {
                if(!this.fastq1uuid)
                {
                    this.fastq1uuid = event.target.id;
                    viewMgr.render();
                    return;
                }
                if(!this.fastq2uuid)
                {
                    this.fastq2uuid = event.target.id;
                    viewMgr.render();
                    return;
                }
                
            }
        }
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(event.target.id == this.fastaInputs[i].uuid)
            {
                if(!this.fastauuid)
                {
                    this.fastauuid = event.target.id;
                    viewMgr.render();
                    return;
                }
            }
        }
    }

}

export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new ReportView(div));
}