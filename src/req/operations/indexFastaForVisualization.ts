import * as atomic from "./atomicOperations";
import {Fasta,get2BitPath} from "./../fasta";
import {getContigsFromFastaFile} from "./../fastaContigLoader";
import {getPath} from "./../file";

import {getReadable,getReadableAndWritable} from "./../getAppPath";

import {Job} from "./../main/Job";

import {faToTwoBit} from "./indexFasta/faToTwoBit";
export class IndexFastaForVisualization extends atomic.AtomicOperation
{
    public fasta : Fasta;
    public faToTwoBitExe : string;

    public twoBitPath : string;
    public twoBitJob : Job;
    public twoBitFlags : atomic.CompletionFlags;
    constructor()
    {
        super();
        this.twoBitFlags = new atomic.CompletionFlags();

        this.faToTwoBitExe = getReadable('faToTwoBit');
    }
    public setData(data : Fasta) : void
    {
        this.fasta = data;
        this.twoBitPath = get2BitPath(this.fasta);
        this.destinationArtifacts.push(this.twoBitPath);
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Index Fasta for Visualization");

        let self = this;
        (async function(){
            return new Promise<void>(async (resolve,reject) => {
                try
                {
                    self.progressMessage = "Building 2bit archive";
                    self.update();
                    await faToTwoBit(self);
                    self.setSuccess(self.twoBitFlags);
                    
                    self.progressMessage = "Reading contigs";
                    self.update();

                    //don't reparse contigs if we don't have to
                    //contigs are parsed during viz indexing as well
                    //if we reparse, we will clobber contig uuids and all references which point to them
                    if(!self.fasta.contigs || self.fasta.contigs.length == 0)
                    {
                        self.fasta.contigs = await getContigsFromFastaFile(getPath(self.fasta));
                    }
                    self.fasta.indexedForVisualization = true;
                    self.setSuccess(self.flags);
                    self.update();
                }
                catch(err)
                {
                    self.abortOperationWithMessage(err);
                }
            });
        })();
    }
}