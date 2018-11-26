import * as atomic from "./atomicOperations";
import {Fasta,getFaiPath} from "../fasta";
import {getContigsFromFastaFile} from "../fastaContigLoader";
import {getPath} from "../file";

import {getReadable,getReadableAndWritable} from "../getAppPath";

import {Job} from "../main/Job";

import {hisat2Build} from "./indexFasta/hisat2Build";
import {samToolsFaidx} from "./indexFasta/samToolsFaidx";
export class IndexFastaForHisat2Alignment extends atomic.AtomicOperation
{
    public fasta : Fasta;

    public samToolsExe : string;
    public hisat2BuildExe : string;

    public faiPath : string;
    public faiJob : Job;
    public faiFlags : atomic.CompletionFlags;

    public hisat2IndexPath : string;
    public hisat2Job : Job;
    public hisat2Flags : atomic.CompletionFlags;
    public hisat2SizeThreshold : number;
    public hisat2Indices : Array<string>;
    constructor()
    {
        super();
        this.faiFlags = new atomic.CompletionFlags();
        this.hisat2Flags = new atomic.CompletionFlags();

        this.hisat2Indices = new Array<string>();

        //the size threshold between being 32-bit and being 64-bit
        this.hisat2SizeThreshold = 4294967096;

        this.samToolsExe = getReadable('samtools');
        if(process.platform == "linux")
            this.hisat2BuildExe = getReadable('hisat2-build');
        else if(process.platform == "win32")
            this.hisat2BuildExe = getReadable('python/python.exe');
    }
    public setData(data : Fasta) : void
    {
        this.fasta = data;

        this.faiPath = getFaiPath(this.fasta);
        this.destinationArtifacts.push(this.faiPath);

        //samtool faidx will write the .fai beside the input fasta
        this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);

        this.hisat2IndexPath = getReadableAndWritable(`rt/indexes/${this.fasta.uuid}`);

        //if 64-bit, add a 1 to the file extension
        let x64 : string = (this.fasta.size > this.hisat2SizeThreshold ? "1" : "");

        this.hisat2Indices.push(`${this.hisat2IndexPath}.1.ht2${x64}`);
        this.hisat2Indices.push(`${this.hisat2IndexPath}.2.ht2${x64}`);
        this.hisat2Indices.push(`${this.hisat2IndexPath}.3.ht2${x64}`);
        this.hisat2Indices.push(`${this.hisat2IndexPath}.4.ht2${x64}`);

        this.destinationArtifacts.concat(this.hisat2Indices);
        
    }
    //hisat2Build -> samTools faidx
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Index Fasta for Alignment");

        let self = this;
        (async function(){
            return new Promise<void>(async (resolve,reject) => {
                try
                {
                    self.progressMessage = "Building hisat2 index";
                    self.update();
                    await hisat2Build(self);
                    self.setSuccess(self.hisat2Flags);
                    self.update();

                    self.progressMessage = "Building fai index";
                    self.update();

                    await samToolsFaidx(self.fasta,self);
                    self.setSuccess(self.faiFlags);
                    self.update();

                    self.progressMessage = "Reading contigs";
                    self.update();

                    //don't reparse contigs if we don't have to
                    //contigs are parsed during viz indexing as well
                    //if we reparse, we will clobber contig uuids and all references which point to them
                    if(!self.fasta.contigs || self.fasta.contigs.length == 0)
                    {
                        //contig information is required by the coverage distillation step of aligning
                        self.fasta.contigs = await getContigsFromFastaFile(getPath(self.fasta));
                    }

                    self.setSuccess(self.flags);
                    self.fasta.indexed = true;
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