import * as fs from "fs";

import * as atomic from "./atomicOperations";
import {getFolderSize} from "./../getFolderSize";
import formatByteString from "./../renderer/formatByteString";
import {Fasta,getFaiPath} from "./../fasta";
import Fastq from "./../fastq";
import {alignData} from "./../alignData"
import {getReadable,getReadableAndWritable} from "./../getAppPath";
import {Job} from "./../main/Job";

import {bowTie2Align} from "./RunAlignment/bowTie2Align";
import {samToolsDepth} from "./RunAlignment/samToolsDepth";
import {samToolsIndex} from "./RunAlignment/samToolsIndex";
import {samToolsSort} from "./RunAlignment/samToolsSort";
import {samToolsView} from "./RunAlignment/samToolsView";
import {samToolsFaidx} from "./indexFasta/samToolsFaidx";
import {samToolsMPileup} from "./RunAlignment/samToolsMPileup";
import {samToolsIdxStats} from "./RunAlignment/samToolsIdxStats";

import {varScanMPileup2SNP} from "./RunAlignment/varScanMPileup2SNP"

export class RunAlignment extends atomic.AtomicOperation
{
    public alignData : alignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq;

    public samToolsExe : string;
    public bowtie2Exe : string;
    public varScanExe : string;

    public faiPath : string;

    public bowtieJob : Job;
    public samToolsIndexJob : Job;
    public samToolsSortJob : Job;
    public samToolsViewJob : Job;
    public samToolsDepthJob : Job;
    public samToolsMPileupJob : Job;
    public samToolsIdxStatsJob : Job;
    public faiJob : Job;
    public varScanMPileup2SNPJob : Job;

    public samToolsCoverageFileStream : fs.WriteStream;
    public samToolsMPileupStream : fs.WriteStream;
    public samToolsIdxStatsStream : fs.WriteStream;
    public varScanMPileup2SNPStdOutStream : fs.WriteStream;

    public bowtieFlags : atomic.CompletionFlags;
    public samToolsIndexFlags : atomic.CompletionFlags;
    public samToolsSortFlags : atomic.CompletionFlags;
    public samToolsViewFlags : atomic.CompletionFlags;
    public samToolsDepthFlags : atomic.CompletionFlags;
    public samToolsMPileupFlags : atomic.CompletionFlags;
    public samToolsIdxStatsFlags : atomic.CompletionFlags;
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
        this.samToolsIdxStatsFlags = new atomic.CompletionFlags();
        this.varScanMPileup2SNPFlags = new atomic.CompletionFlags();

        this.samToolsExe = getReadable('samtools');
        if(process.platform == "linux")
            this.bowtie2Exe = getReadable('bowtie2');
        else if(process.platform == "win32")
            this.bowtie2Exe = getReadable('perl/perl/bin/perl.exe');

        this.varScanExe = getReadable("varscan.jar");
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

            this.faiPath = getFaiPath(this.fasta);

            this.alignData = new alignData();
            this.alignData.type = data.type;
            this.alignData.fasta = this.fasta;
            this.alignData.fastqs.push(this.fastq1,this.fastq2);
            this.generatedArtifacts.push(`${this.fasta.path}.fai`);
            this.destinationArtifactsDirectories.push(getReadableAndWritable(`rt/AlignmentArtifacts/${this.alignData.uuid}`));
        }
    //bowtie2-align -> samtools view -> samtools sort -> samtools index -> samtools depth -> separate out coverage data
    //-> samtools faidx -> samtools mpileup -> varscan pileup2snp
    public run() : void
    {
        let self = this;
        bowTie2Align(this.alignData,()=>{}).then((result) => {

            self.setSuccess(self.bowtieFlags);
            self.update();

            samToolsView(self.alignData).then((result) => {

                self.setSuccess(self.samToolsViewFlags);
                self.update();

                samToolsSort(self.alignData).then((result) => {

                    self.setSuccess(self.samToolsIndexFlags);
                    self.update();

                    samToolsIndex(self.alignData).then((result) => {

                        self.setSuccess(self.samToolsIndexFlags);
                        self.update();

                        samToolsDepth(self.alignData).then((result) => {

                            samToolsFaidx(self.alignData.fasta).then((result) => {

                                samToolsMPileup(self).then((result) => {

                                    self.setSuccess(self.samToolsMPileupFlags);

                                    varScanMPileup2SNP(self).then((result) => {

                                        self.setSuccess(self.varScanMPileup2SNPFlags);

                                        samToolsIdxStats(self).then((result) => {

                                            self.setSuccess(self.samToolsIdxStatsFlags);

                                            self.alignData.size = getFolderSize(getReadableAndWritable(`rt/AlignmentArtifacts/${self.alignData.uuid}`));
                                            self.alignData.sizeString = formatByteString(self.alignData.size);

                                            self.setSuccess(self.flags);
                                            self.update();
                                            
                                        }).catch((err) => {
                                            self.abortOperationWithMessage(err);
                                        });
                                    }).catch((err) => {
                                        self.abortOperationWithMessage(err);
                                    });
                                }).catch((err) => {
                                    self.abortOperationWithMessage(err);
                                });
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
    }
}