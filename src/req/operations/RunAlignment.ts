import * as fs from "fs";

import * as atomic from "./atomicOperations";
import {Fasta} from "./../fasta";
import Fastq from "./../fastq";
import alignData from "./../alignData"
import {SpawnRequestParams} from "./../JobIPC";
import {Job,JobCallBackObject} from "./../main/Job";
import {parseBowTie2AlignmentReport} from "./../bowTie2AlignmentReportParser";

export class RunAlignment extends atomic.AtomicOperation
{
    public alignData : alignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq;

    public samToolsExe : string;
    public bowtie2Exe : string;

    public bowtieJob : Job;
    public samToolsIndexJob : Job;
    public samToolsSortJob : Job;
    public samToolsViewJob : Job;
    public samToolsDepthJob : Job;

    public samToolsCoverageFileStream : fs.WriteStream;

    public bowtieFlags : atomic.CompletionFlags;
    public samToolsIndexFlags : atomic.CompletionFlags;
    public samToolsSortFlags : atomic.CompletionFlags;
    public samToolsViewFlags : atomic.CompletionFlags;
    public samToolsDepthFlags : atomic.CompletionFlags;
    constructor()
    {
        super();

        this.bowtieFlags = new atomic.CompletionFlags();
        this.samToolsIndexFlags = new atomic.CompletionFlags();
        this.samToolsSortFlags = new atomic.CompletionFlags();
        this.samToolsViewFlags = new atomic.CompletionFlags();
        this.samToolsDepthFlags = new atomic.CompletionFlags();

        this.samToolsExe = 'resources/app/samtools';
        if(process.platform == "linux")
            this.bowtie2Exe = 'resources/app/bowtie2';
        else if(process.platform == "win32")
            this.bowtie2Exe = 'resources/app/perl/perl/bin/perl.exe';
    }
    public setData(
        data : {
            fasta : Fasta,
            fastq1 : Fastq,
            fastq2 : Fastq,
            type : string
        }) : void
        {
            this.fasta = data.fasta;
            this.fastq1 = data.fastq1;
            this.fastq2 = data.fastq2;
            this.alignData = new alignData();
            this.alignData.type = data.type;
            this.alignData.fasta = this.fasta;
            this.alignData.fastqs.push(this.fastq1,this.fastq2);
            this.destinationArtifactsDirectories.push(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}`);
        }
    //bowtie2-align -> samtools view -> samtools sort -> samtools index -> samtools depth
    public run() : void
    {
        let self = this;
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(self.flags.done)
                    return;
                if(params.processName == self.bowtie2Exe)
                {
                    if(params.unBufferedData)
                        self.alignData.summaryText += params.unBufferedData;
                    self.spawnUpdate = params;
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.bowtieFlags);
                            setTimeout(
                                function(){
                                    self.alignData.summary = parseBowTie2AlignmentReport(self.alignData.summaryText);
                                    self.samToolsViewJob = new Job(
                                        self.samToolsExe,
                                        <string[]>[
                                            "view",
                                            "-bS",
                                            `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sam`,
                                            "-o",
                                            `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.bam`,
                                        ],
                                        "",true,jobCallBack,{}
                                    );
                                    try
                                    {
                                        self.samToolsViewJob.Run();
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
                                        return;
                                    }
                                },500
                            );
                        }
                        else
                        {
                            self.abortOperationWithMessage(params.unBufferedData);
                            self.update();
                        }
                    }
                }
                if(params.processName == self.samToolsExe && params.args[0] == "view")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.samToolsViewFlags);
                            setTimeout(
                                function(){
                                    let input : string = `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.bam`;
                                    let output : string;
                                    if(process.platform == "win32")
                                        output = `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted`
                                    else if(process.platform == "linux")
                                        output = `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam`

                                    let args : Array<string> = new Array<string>();
                                    if(process.platform == "linux")
                                    {
                                        args = <Array<string>>[
                                            "sort",
                                            input,
                                            "-o",
                                            output
                                        ];
                                    }
                                    //samtools sort options are slightly different on windows for some reason
                                    else if(process.platform == "win32")
                                    {
                                        args = <Array<string>>[
                                            "sort",
                                            input,
                                            output
                                        ];
                                    }
                                    self.samToolsSortJob = new Job(self.samToolsExe,args,"",true,jobCallBack,{});
                                    try
                                    {
                                        self.samToolsSortJob.Run();
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
                                        return;
                                    }
                                },500
                            );
                        }
                        else
                        {
                            self.abortOperationWithMessage(params.unBufferedData);
                            self.update();
                        }
                    }
                    /*else
                    {
                        self.abortOperationWithMessage(`Failed to generate bam for ${self.alignData.alias}`);
                        return;
                    }*/
                }
                if(params.processName == self.samToolsExe && params.args[0] == "sort")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.samToolsSortFlags);
                            setTimeout(
                                function(){
                                    self.samToolsIndexJob = new Job(
                                        self.samToolsExe,
                                        <Array<string>>[
                                            "index",
                                            `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam`,
                                            `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam.bai`
                                        ],"",true,jobCallBack,{}
                                    );
                                    try
                                    {
                                        self.samToolsIndexJob.Run();
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
                                        return;
                                    }
                                },500
                            );
                        }
                        else
                        {
                            self.abortOperationWithMessage(`Failed to sort bam for ${self.alignData.alias}`);
                            self.update();
                            return;
                        }
                    }
                }
                if(params.processName == self.samToolsExe && params.args[0] == "index")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            self.setSuccess(self.samToolsIndexFlags);
                            setTimeout(
                                function(){
                                    self.samToolsDepthJob = new Job(
                                        self.samToolsExe,
                                        <Array<string>>[
                                            "depth",
                                            `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam`
                                        ],"",true,jobCallBack,{}
                                    );
                                    try
                                    {
                                        self.samToolsDepthJob.Run();
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
                                        return;
                                    }
                                    self.samToolsCoverageFileStream = fs.createWriteStream(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/depth.coverage`)
                                },500
                            );
                            //self.setSuccess(self.flags);
                        }
                        else
                        {
                            self.abortOperationWithMessage(`Failed to index bam for ${self.alignData.alias}`);
                            self.update();
                            return;
                        }
                    }
                }
                if(params.processName == self.samToolsExe && params.args[0] == "depth")
                {
                    if(params.unBufferedData)
                    {
                        self.samToolsCoverageFileStream.write(params.unBufferedData);
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        setTimeout(
                            function(){
                                self.setSuccess(self.samToolsDepthFlags);
                                self.setSuccess(self.flags);
                                self.samToolsCoverageFileStream.end();
                                self.update();
                            },500
                        );
                    }
                    else
                    {
                        self.abortOperationWithMessage(`Failed to get depth for ${self.alignData.alias}`);
                        self.update();
                        self.samToolsCoverageFileStream.end();
                        return;
                    }
                }
                self.update();
            }
        };
        let args : Array<string> = new Array<string>();
        if(process.platform == "win32")
            args.push("resources/app/bowtie2");
        args.push("-x");
        args.push(`resources/app/rt/indexes/${this.fasta.uuid}`);
        args.push("-1");
        args.push(this.fastq1.path);
        args.push("-2");
        args.push(this.fastq2.path);
        args.push("-S");
        args.push(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}/out.sam`);

        let invokeString = "";
        for(let i = 0; i != args.length; ++i)
        {
            invokeString += args[i];
            invokeString += " ";
        }
        this.alignData.invokeString = invokeString;
        this.alignData.alias = `${this.fastq1.alias}, ${this.fastq2.alias}; ${this.fasta.alias}`;
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}`);
        this.bowtieJob = new Job(this.bowtie2Exe,args,"",true,jobCallBack,{});
        try
        {
            this.bowtieJob.Run();
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
            return;
        }
        this.update();
    }

}