import * as electron from "electron";

import {Fastq} from "../../fastq";
import {AtomicOperationIPC} from "../../atomicOperationsIPC";
import {enQueueOperation} from "../enQueueOperation";
const ipc = electron.ipcRenderer;

export function generateFastQCReport(fastq: Fastq): void 
{
    enQueueOperation({
        opName: "generateQCReport",
        data: fastq
    });
}
