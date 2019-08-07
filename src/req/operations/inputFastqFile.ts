import * as atomic from "./atomicOperations";
import {Fastq} from "./../fastq";
export class InputFastqFile extends atomic.AtomicOperation
{
    public filePath : string | undefined;
    public fastq : Fastq | undefined;
    public constructor()
    {
        super();
        this.ignoreScheduler = true;
    }
    public setData(data : string) : void
    {
        this.filePath = data;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name!,"Input Fastq File");
        try
        {
            this.fastq = new Fastq(this.filePath!);
            this.fastq.checked = true;
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
        }
        this.setSuccess(this.flags);
        this.update!();
    }
}