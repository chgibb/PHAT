import * as fs from "fs";

const fse = require("fs-extra");

import * as atomic from "./atomicOperations";
import {Fasta} from "./../fasta";
import {Contig,FastaContigLoader} from "./../fastaContigLoader";
import {getQCReportSummaries} from "./../QCReportSummary";
import trimPath from "./../trimPath";
import {makeValidID} from "./../MakeValidID";
import {SpawnRequestParams} from "./../JobIPC";

import {Job,JobCallBackObject} from "./../main/Job";

import {bowTie2Build} from "./indexFasta/bowTie2Build";
import {faToTwoBit} from "./indexFasta/faToTwoBit";
import {samToolsFaidx} from "./indexFasta/samToolsFaidx";
export class IndexFasta extends atomic.AtomicOperation
{
    public fasta : Fasta;

    public faToTwoBitExe : string;
    public samToolsExe : string;
    public bowtie2BuildExe : string;


    public twoBitPath : string;
    public twoBitJob : Job;
    public twoBitFlags : atomic.CompletionFlags;

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
        this.twoBitFlags = new atomic.CompletionFlags();
        this.faiFlags = new atomic.CompletionFlags();
        this.bowtieFlags = new atomic.CompletionFlags();

        this.bowtieIndices = new Array<string>();

        //the size threshold between being 32-bit and being 64-bit
        this.bowtieSizeThreshold = 4294967096;

        this.faToTwoBitExe = 'resources/app/faToTwoBit';
        this.samToolsExe = 'resources/app/samtools';
        if(process.platform == "linux")
            this.bowtie2BuildExe = 'resources/app/bowtie2-build';
        else if(process.platform == "win32")
            this.bowtie2BuildExe = 'resources/app/python/python.exe';
    }
    public setData(data : Fasta) : void
    {
        this.fasta = data;

        this.twoBitPath = `resources/app/rt/indexes/${this.fasta.uuid}.2bit`;
        this.destinationArtifacts.push(this.twoBitPath);

        this.fasta.twoBit = this.twoBitPath;

        this.faiPath = `resources/app/rt/indexes/${this.fasta.uuid}.fai`;
        this.destinationArtifacts.push(this.faiPath);
        this.fasta.fai = this.faiPath;

        //samtool faidx will write the .fai beside the input fasta
        this.generatedArtifacts.push(`${this.fasta.path}.fai`);

        this.bowTieIndexPath = `resources/app/rt/indexes/${this.fasta.uuid}`;

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
    //faToTwoBit -> samTools faidx -> bowtie2-build -> ContigLoader
    public run() : void
    {
        let self = this;

        faToTwoBit(self).then((result) => {

            self.setSuccess(self.twoBitFlags);
            self.update();
            console.log("fatotwobit");

            samToolsFaidx(self).then((result) => {

                self.setSuccess(self.faiFlags);
                self.update();
                console.log("samtoolsfaidx");

                bowTie2Build(self).then((result) => {

                    self.setSuccess(self.bowtieFlags);
                    self.update();
                    console.log("bowtie2build");

                    let contigLoader = new FastaContigLoader();
                    contigLoader.on(
                        "doneLoadingContigs",function(){
                            self.fasta.contigs = contigLoader.contigs;
                            self.setSuccess(self.flags);
                            self.fasta.indexed = true;
                            self.update();
                            console.log("doneloadingcontigs");
                        }
                    );
                    contigLoader.beginRefStream(self.fasta.path);

                }).catch((err) => {
                    self.abortOperationWithMessage(err);
                });
            }).catch((err) => {
                self.abortOperationWithMessage(err);
            });
        }).catch((err) => {
            self.abortOperationWithMessage(err);
        });
        /*let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(self.flags.done)
					    return;
                if(params.processName == self.faToTwoBitExe)
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.twoBitFlags);
                            self.faiJob = new Job(self.samToolsExe,["faidx",self.fasta.path],"",true,jobCallBack,{});
                            try
                            {
                                self.faiJob.Run();
                            }
                            catch(err)
                            {
                                self.abortOperationWithMessage(err);
                                return;
                            }
                            self.spawnUpdate = params;
                            self.update();
                        }
                        else
                        {
                            self.abortOperationWithMessage(`Failed to create 2bit index for ${self.fasta.alias}`);
                            return;
                        }
                    }
                }
                if(params.processName == self.samToolsExe)
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.faiFlags);
                            setTimeout(
                                function()
                                {
                                    try
                                    {
                                        fse.copySync(`${self.fasta.path}.fai`,self.faiPath);
                                        self.setSuccess(self.faiFlags);
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
								        return;
                                    }
                                    let bowtieArgs : Array<string> = new Array<string>();
                                    if(process.platform == "linux")
                                        bowtieArgs = [self.fasta.path,self.bowTieIndexPath];
                                    else if(process.platform == "win32")
                                        bowtieArgs = ['resources/app/bowtie2-build',`"${self.fasta.path}"`,`"${self.bowTieIndexPath}"`];
                                    self.bowtieJob = new Job(self.bowtie2BuildExe,bowtieArgs,"",true,jobCallBack,{});
                                    try
                                    {
                                        self.bowtieJob.Run();
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
                                        return;
                                    }

                                },1000
                            );
                            self.spawnUpdate = params;
                            self.update();
                        }
                        else
                        {
                            self.abortOperationWithMessage(`Failed to create fai index for ${self.fasta.alias}`);
                            return;
                        }
                    }
                }
                if(params.processName == self.bowtie2BuildExe)
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.bowtieFlags);
                            setTimeout(
                                function()
                                {
                                    try
                                    {
                                        for(let i : number = 0; i != self.bowtieIndices.length; ++i)
                                        {
                                            fs.accessSync(`${self.bowtieIndices[i]}`,fs.constants.F_OK | fs.constants.R_OK);
                                        }
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(`Failed to write all bowtie2 indices for ${self.fasta.alias}`);
                                        return;
                                    }
                                    self.fasta.indexed = true;
                                    let contigLoader = new FastaContigLoader();
                                    contigLoader.on(
                                        "doneLoadingContigs",function()
                                        {
                                            self.fasta.contigs = contigLoader.contigs;
                                            self.setSuccess(self.flags);
                                            self.spawnUpdate = params;
                                            self.update();
                                        }
                                    );
                                    contigLoader.beginRefStream(self.fasta.path);
                                },5000
                            );
                        }
                        else
                        {
                            self.abortOperationWithMessage(`Failed to create bowtie2 index for ${self.fasta.alias}`);
                            return;
                        }
                    }
                }
            }
        }
        this.twoBitJob = new Job(this.faToTwoBitExe,[this.fasta.path,this.twoBitPath],"",true,jobCallBack,{});
        try
        {
            this.twoBitJob.Run();
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
            return;
        }
        this.update();
        */
    }
}