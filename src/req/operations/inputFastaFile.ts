import * as atomic from "./atomicOperations";
import { Fasta } from "./../fasta";

export interface InputFastaFileData {
    opName: "inputFastaFile";
    data: string;
}

export class InputFastaFile extends atomic.AtomicOperation<InputFastaFileData>
{
    public filePath: string;
    public fasta: Fasta | undefined;
    public constructor(data: InputFastaFileData) {
        super(data);
        this.ignoreScheduler = true;

        this.filePath = data.data;
    }

    public run(): void {
        this.logRecord = atomic.openLog(this.opName, "Input Fasta File");
        try {
            this.fasta = new Fasta(this.filePath);
            this.fasta.checked = true;
        }
        catch (err) {
            this.abortOperationWithMessage(err);
        }
        this.setSuccess(this.flags);
        this.update!();
    }
}