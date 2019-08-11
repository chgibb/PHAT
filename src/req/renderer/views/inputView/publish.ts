import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {Fasta} from "../../../fasta";
import {AtomicOperationIPC} from "../../../atomicOperationsIPC";
import {AlignData} from "../../../alignData";
import {SaveKeyEvent} from "../../../ipcEvents";
import {Fastq} from "../../../fastq";
import { enQueueOperation } from '../../enQueueOperation';

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
            enQueueOperation({
                opName : "importFileIntoProject",
                data : val[i]
            });
        }
    }
}

export function importSelectedFastas(val : Array<Fasta>) : void
{
    for(let i = 0; i != val.length; ++i)
    {
        if(val[i].checked)
        {
            enQueueOperation({
                opName : "importFileIntoProject",
                data : val[i]
            })
        }
    }
}

export function indexFastaForVisualization(val : Fasta) : void
{
    enQueueOperation({
        opName : "indexFastaForVisualization",
        data : val
    })
}

export function linkRefSeqToAlignment(fasta : Fasta,align : AlignData) : void
{
    enQueueOperation({
        opName : "linkRefSeqToAlignment",
        fasta : fasta,
        align : align
    });
}