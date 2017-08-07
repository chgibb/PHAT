import * as atomic from "./atomicOperations";
import {Fasta} from "./../fasta";
export class InputFastaFile extends atomic.AtomicOperation
{
    public filePath : string;
    public fasta : Fasta;
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
        this.logKey = atomic.openLog(this.name,"Input Fasta File");
        try
        {
            this.fasta = new Fasta(this.filePath);
            this.fasta.checked = true;
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
        }
        this.setSuccess(this.flags);
        this.update();
    }
}