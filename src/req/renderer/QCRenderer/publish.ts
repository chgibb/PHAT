import * as electron from "electron";

import {Fastq} from "../../fastq";
import {AtomicOperationIPC} from "../../atomicOperationsIPC";
const ipc = electron.ipcRenderer;

export function generateFastQCReport(fastq: Fastq): void 
{
    ipc.send(
        "runOperation", 
        <AtomicOperationIPC>{
            opName: "generateFastQCReport",
            channel: "input",
            key: "fastqInputs",
            uuid: fastq.uuid
        }
    );
}
