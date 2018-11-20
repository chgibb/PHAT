import * as atomic from "./atomicOperations";
import {Fasta,getFaiPath} from "../fasta";
import {getContigsFromFastaFile} from "../fastaContigLoader";
import {getPath} from "../file";

import {getReadable,getReadableAndWritable} from "../getAppPath";

import {Job} from "../main/Job";

import {bowTie2Build} from "./indexFasta/bowTie2Build";
import {samToolsFaidx} from "./indexFasta/samToolsFaidx";
export class IndexFastaForBowtie2Alignment extends atomic.AtomicOperation
{
    public fasta : Fasta;

    public samToolsExe : string;
    public bowtie2BuildExe : string;

    public faiPath : string;
    public faiJob : Job;
    public faiFlags : atomic.CompletionFlags;

    public bowTieIndexPath : string;
    public bowtieJob : Job;
    public bowtieFlags : atomic.CompletionFlags;
    public bowtieSizeThreshold : number;
    public bowtieIndices : Array<string>;
    constructor()
    {
        super();
        this.faiFlags = new atomic.CompletionFlags();
        this.bowtieFlags = new atomic.CompletionFlags();

        this.bowtieIndices = new Array<string>();

        //the size threshold between being 32-bit and being 64-bit
        this.bowtieSizeThreshold = 4294967096;

        this.samToolsExe = getReadable('samtools');
        if(process.platform == "linux")
            this.bowtie2BuildExe = getReadable('bowtie2-build');
        else if(process.platform == "win32")
            this.bowtie2BuildExe = getReadable('python/python.exe');
    }
    public setData(data : Fasta) : void
    {
        this.fasta = data;

        this.faiPath = getFaiPath(this.fasta);
        this.destinationArtifacts.push(this.faiPath);

        //samtool faidx will write the .fai beside the input fasta
        this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);

        this.bowTieIndexPath = getReadableAndWritable(`rt/indexes/${this.fasta.uuid}`);

        //if 64-bit, add a 1 to the file extension
        let x64 : string = (this.fasta.size > this.bowtieSizeThreshold ? "1" : "");

        this.bowtieIndices.push(`${this.bowTieIndexPath}.1.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.2.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.3.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.4.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.rev.1.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.rev.2.bt2${x64}`);

        this.destinationArtifacts.concat(this.bowtieIndices);
        
    }
    //bowTie2Build -> samTools faidx
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Index Fasta for Alignment");

        let self = this;
        (async function(){
            return new Promise<void>(async (resolve,reject) => {
                try
                {
                    self.progressMessage = "Building bowtie2 index";
                    self.update();
                    await bowTie2Build(self);
                    self.setSuccess(self.bowtieFlags);
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