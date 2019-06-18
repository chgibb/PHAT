import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {Fasta} from "../../fasta";
import {AtomicOperationIPC} from "../../atomicOperationsIPC";
import {AlignData} from "../../alignData";

import {SaveKeyEvent} from "./../../ipcEvents";
import {Fastq} from "./../../fastq";

let channel = "input";

export function setDataChannel(chan : string) : void
{
    channel = chan;
}

export function publishFastqInputs(val : Array<Fastq>) : void 
{
    ipc.send(
        "saveKey",
        {
            action : "saveKey",
            channel : channel,
            key : "fastqInputs",
            val : val
        } as SaveKeyEvent
    );
}

export function publishFastaInputs(val : Array<Fasta>) : void 
{
    ipc.send(
        "saveKey",
        {
            action : "saveKey",
            channel : channel,
            key : "fastaInputs",
            val : val
        } as SaveKeyEvent
    );
}


export function importSelectedFastqs(val : Array<Fastq>) : void
{
    for(let i = 0; i != val.length; ++i)
    {
        if(val[i].checked)
        {
            ipc.send(
                "runOperation",
                {
                    opName : "importFileIntoProject",
                    uuid : val[i].uuid
                } as AtomicOperationIPC
            );
        }
    }
}

export function importSelectedFastas(val : Array<Fasta>) : void
{
    for(let i = 0; i != val.length; ++i)
    {
        if(val[i].checked)
        {
            ipc.send(
                "runOperation",
                {
                    opName : "importFileIntoProject",
                    uuid : val[i].uuid
                } as AtomicOperationIPC
            );
        }
    }
}

export function indexFastaForVisualization(val : Fasta) : void
{
    ipc.send(
        "runOperation",
        {
            opName : "indexFastaForVisualization",
            channel : "input",
            key : "fastaInputs",
            uuid : val.uuid
        } as AtomicOperationIPC
    );
}

export function linkRefSeqToAlignment(fasta : Fasta,align : AlignData) : void
{
    ipc.send(
        "runOperation",
        {
            opName : "linkRefSeqToAlignment",
            fasta : fasta,
            align : align
        } as AtomicOperationIPC
    );
}