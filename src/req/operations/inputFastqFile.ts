import * as atomic from "./atomicOperations";
import { Fastq } from "./../fastq";

export interface InputFastqFileData {
    operationName: "inputFastqFile";
    data: string;
}
export class InputFastqFile extends atomic.AtomicOperation<InputFastqFileData>
{
    public filePath: string;
    public fastq: Fastq | undefined;
    public constructor(data: InputFastqFileData) {
        super(data);
        this.ignoreScheduler = true;

        this.filePath = data.data;
    }

    public run(): void {
        this.logRecord = atomic.openLog(this.operationName, "Input Fastq File");
        try {
            this.fastq = new Fastq(this.filePath!);
            this.fastq.checked = true;
        }
        catch (err) {
            this.abortOperationWithMessage(err);
        }
        this.setSuccess(this.flags);
        this.update!();
    }
}