import * as atomic from "./atomicOperations";
import Fastq from "./../fastq";
export class InputFastqFile extends atomic.AtomicOperation
{
    public filePath : string;
    public fastq : Fastq;
    constructor()
    {
        super();
    }
    public setData(data : string) : void
    {
        this.filePath = data;
    }
    public run() : void
    {
        this.logKey = atomic.openLog(this.name,"Input Fastq File");
        try
        {
            this.fastq = new Fastq(this.filePath);
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
        }
        this.setSuccess(this.flags);
        this.update();
    }
}