import * as electron from "electron";
import { Fastq } from '../../fastq';
import { Fasta } from '../../fasta';
import { AtomicOperationIPC } from '../../atomicOperationsIPC';
const ipc = electron.ipcRenderer;

export function triggerHisat2Alignment(fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq | undefined) : void
{
    if(!fasta.indexedForHisat2)
    {
        ipc.send(
            "runOperation",
            <AtomicOperationIPC>{
                opName : "indexFastaForHisat2Alignment",
                channel : "input",
                key : "fastaInputs",
                uuid : fasta.uuid
            }
        );
    }

    ipc.send(
        "runOperation",
        <AtomicOperationIPC>{
            opName : "runHisat2Alignment",
            alignParams : {
                fasta : fasta,
                fastq1 : fastq1,
                fastq2 : fastq2
            }
        }
    );
}

export function triggerBowtie2Alignment(fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq | undefined) : void
{
    if(!fasta.indexed)
    {
        ipc.send(
            "runOperation",
            <AtomicOperationIPC>{
                opName : "indexFastaForBowtie2Alignment",
                channel : "input",
                key : "fastaInputs",
                uuid : fasta.uuid
            }
        );
    }

    ipc.send(
        "runOperation",
        <AtomicOperationIPC>{
            opName : "runBowtie2Alignment",
            alignParams : {
                fasta : fasta,
                fastq1 : fastq1,
                fastq2 : fastq2
            }
        }
    );
}
