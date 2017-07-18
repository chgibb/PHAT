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
        return ``;
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