import * as fs from "fs";
import * as readline from "readline";
import * as atomic from "./atomicOperations";
import {Fasta} from "./../fasta";
import Fastq from "./../fastq";
import alignData from "./../alignData"
import {SpawnRequestParams} from "./../JobIPC";
import {Job,JobCallBackObject} from "./../main/Job";
import {parseBowTie2AlignmentReport} from "./../bowTie2AlignmentReportParser";

import {bowTie2Align} from "./RunAlignment/bowTie2Align";
import {samToolsDepth} from "./RunAlignment/samToolsDepth";
import {samToolsIndex} from "./RunAlignment/samToolsIndex";
import {samToolsSort} from "./RunAlignment/samToolsSort";
import {samToolsView} from "./RunAlignment/samToolsView";
import {samToolsMPileup} from "./RunAlignment/samToolsMPileup";

export class RunAlignment extends atomic.AtomicOperation
{
    public alignData : alignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq;

    public samToolsExe : string;
    public bowtie2Exe : string;
    public varScanExe : string;

    public bowtieJob : Job;
    public samToolsIndexJob : Job;
    public samToolsSortJob : Job;
    public samToolsViewJob : Job;
    public samToolsDepthJob : Job;
    public samToolsMPileupJob : Job;
    public varScanMPileup2SNPJob : Job;

    public samToolsCoverageFileStream : fs.WriteStream;
    public samToolsMPileupStream : fs.WriteStream;
    public snpStream : fs.WriteStream;

    public bowtieFlags : atomic.CompletionFlags;
    public samToolsIndexFlags : atomic.CompletionFlags;
    public samToolsSortFlags : atomic.CompletionFlags;
    public samToolsViewFlags : atomic.CompletionFlags;
    public samToolsDepthFlags : atomic.CompletionFlags;
    public samToolsMPileupFlags : atomic.CompletionFlags;
    public varScanMPileup2SNPFlags : atomic.CompletionFlags;
    constructor()
    {
        super();

        this.bowtieFlags = new atomic.CompletionFlags();
        this.samToolsIndexFlags = new atomic.CompletionFlags();
        this.samToolsSortFlags = new atomic.CompletionFlags();
        this.samToolsViewFlags = new atomic.CompletionFlags();
        this.samToolsDepthFlags = new atomic.CompletionFlags();
        this.samToolsMPileupFlags = new atomic.CompletionFlags();
        this.varScanMPileup2SNPFlags = new atomic.CompletionFlags();

        this.samToolsExe = 'resources/app/samtools';
        if(process.platform == "linux")
            this.bowtie2Exe = 'resources/app/bowtie2';
        else if(process.platform == "win32")
            this.bowtie2Exe = 'resources/app/perl/perl/bin/perl.exe';

        this.varScanExe = "java";
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
            this.generatedArtifacts.push(`${this.fasta.path}.fai`);
            this.destinationArtifactsDirectories.push(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}`);
        }
    //bowtie2-align -> samtools view -> samtools sort -> samtools index -> samtools depth -> separate out coverage data
    public run() : void
    {
        let self = this;
        bowTie2Align(this).then((result) => {

            self.setSuccess(self.bowtieFlags);
            self.update();

            samToolsView(self).then((result) => {

                self.setSuccess(self.samToolsViewFlags);
                self.update();

                samToolsSort(self).then((result) => {

                    self.setSuccess(self.samToolsIndexFlags);
                    self.update();

                    samToolsIndex(self).then((result) => {

                        self.setSuccess(self.samToolsIndexFlags);
                        self.update();

                        samToolsDepth(self).then((result) => {

                            samToolsMPileup(self).then((result) => {

                                self.setSuccess(self.samToolsMPileupFlags);

                                self.setSuccess(self.flags);
                                self.update();

                            }).catch((err) => {
                                self.abortOperationWithMessage(err);
                            })
                        }).catch((err) => {
                            self.abortOperationWithMessage(err);
                        })
                    }).catch((err) => {
                        self.abortOperationWithMessage(err);
                    })
                }).catch((err) => {
                    self.abortOperationWithMessage(err);
                })
            }).catch((err) => {
                self.abortOperationWithMessage(err);
            })
        }).catch((err) => {
            self.abortOperationWithMessage(err);
        });
        /*
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
                        //Forward through to the depth.coverage file
                        self.samToolsCoverageFileStream.write(params.unBufferedData);
                        
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        setTimeout(
                            function(){
                                self.samToolsCoverageFileStream.end();
                                let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                                    input : fs.createReadStream(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/depth.coverage`)
                                });
                                rl.on("line",function(line){
                                    //distill output from samtools depth into individual contig coverage files identified by uuid and without the contig name.
                                    let coverageTokens = line.split(/\s/g);
                                    for(let i = 0; i != self.fasta.contigs.length; ++i)
                                    {
                                        let contigTokens = self.fasta.contigs[i].name.split(/\s/g);
                                        for(let k = 0; k != coverageTokens.length; ++k)
                                        {
                                            if(coverageTokens[k] == contigTokens[0])
                                            {
                                                fs.appendFileSync(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/contigCoverage/${self.fasta.contigs[i].uuid}`,`${coverageTokens[k+1]} ${coverageTokens[k+2]}\n`);
                                            }
                                        }
                                    }
                                });
                                rl.on("close",function(){
                                    self.setSuccess(self.samToolsDepthFlags);
                                    self.varScanJob = new Job(
                                        self.varScanExe,
                                        <string[]>[
                                            "-jar",
                                            "resources/app/varscan.jar",
                                            "pileup2snp",
                                            `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/depth.coverage`
                                        ],
                                        "",true,jobCallBack,{}
                                    );
                                    try
                                    {
                                        self.varScanJob.Run();
                                    }
                                    catch(err)
                                    {
                                        self.abortOperationWithMessage(err);
                                        return;
                                    }
                                    self.snpStream = fs.createWriteStream(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/snps.vcf`);
                                });
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
                if(params.processName == self.varScanExe)
                {
                    if(params.unBufferedData)
                    {
                        self.snpStream.write(params.unBufferedData);
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        setTimeout(
                            function(){
                                self.snpStream.end();
                                self.setSuccess(self.varScanDepthFlags);
                                self.setSuccess(self.flags);
                                self.update();
                            }
                        );
                    }
                }
                self.update();
            }
        };
        */
    }

}