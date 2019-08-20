import * as electron from "electron";

import {Fastq} from "../../../../fastq";
import {Fasta} from "../../../../fasta";
import {AtomicOperationIPC} from "../../../../atomicOperationsIPC";
import {enQueueOperation} from "../../../enQueueOperation";
const ipc = electron.ipcRenderer;

export function triggerHisat2Alignment(fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq | undefined) : void
{
    if(!fasta.indexedForHisat2)
    {
        enQueueOperation({
            opName : "indexFastaForHisat2Alignment",
            data : fasta
        });
    }

    enQueueOperation({
        opName : "runHisat2Alignment",

        fasta : fasta,
        fastq1 : fastq1,
        fastq2 : fastq2
        
    });
}

export function triggerBowtie2Alignment(fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq | undefined) : void
{
    if(!fasta.indexed)
    {
        enQueueOperation({
            opName : "indexFastaForBowtie2Alignment",
            data : fasta
        });

    }

    enQueueOperation({
        opName : "runBowtie2Alignment",

        fasta : fasta,
        fastq1 : fastq1,
        fastq2 : fastq2
        
    });
}
