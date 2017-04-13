import * as atomic from "./atomicOperations";
import Fasta from "./renderer/fastq";
import {getQCReportSummaries} from "./renderer/QC/QCReportSummary";
import trimPath from "./renderer/trimPath";
import {makeValidID} from "./renderer/MakeValidID";
import {SpawnRequestParams} from "./JobIPC";

import {Job,JobCallBackObject} from "./main/Job";
export class IndexFasta extends atomic.AtomicOperation
{
    public fasta : Fasta;
    public twoBitPath : string;
    public twoBitJob : Job;
    public twoBitFlags : atomic.CompletionFlags;
    constructor()
    {
        super();
        this.twoBitFlags = new atomic.CompletionFlags();
    }
    public setData(data : Fasta) : void
    {
        this.fasta = data;
        this.twoBitPath = `resources/app/rt/indexes/${this.fasta.uuid}.2bit`;
        this.destinationArtifacts.push(this.twoBitPath);
    }
    public run() : void
    {
        let self = this;
        let twoBitCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(self.flags.done)
					return;
                if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                        self.setSuccess(self.twoBitFlags);
                    else
                    {
                        self.abortOperationWithMessage(`Failed to create 2bit index for ${self.fasta.uuid}`);
                        return;
                    }
                }
            }
        }
        this.twoBitJob = new Job('resources/app/faToTwoBit',[this.fasta.path,this.twoBitPath],"",true,twoBitCallBack,{});
        try
        {
            this.twoBitJob.Run();
        }
        catch(err)
        {
            self.abortOperationWithMessage(err);
            return;
        }
    }
}