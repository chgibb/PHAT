"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atomic = require("./atomicOperations");
const fasta_1 = require("./../fasta");
const alignData_1 = require("./../alignData");
const getAppPath_1 = require("./../getAppPath");
const bowTie2Align_1 = require("./RunAlignment/bowTie2Align");
const samToolsDepth_1 = require("./RunAlignment/samToolsDepth");
const samToolsIndex_1 = require("./RunAlignment/samToolsIndex");
const samToolsSort_1 = require("./RunAlignment/samToolsSort");
const samToolsView_1 = require("./RunAlignment/samToolsView");
const samToolsFaidx_1 = require("./indexFasta/samToolsFaidx");
const samToolsMPileup_1 = require("./RunAlignment/samToolsMPileup");
const varScanMPileup2SNP_1 = require("./RunAlignment/varScanMPileup2SNP");
class RunAlignment extends atomic.AtomicOperation {
    constructor() {
        super();
        this.bowtieFlags = new atomic.CompletionFlags();
        this.samToolsIndexFlags = new atomic.CompletionFlags();
        this.samToolsSortFlags = new atomic.CompletionFlags();
        this.samToolsViewFlags = new atomic.CompletionFlags();
        this.samToolsDepthFlags = new atomic.CompletionFlags();
        this.samToolsMPileupFlags = new atomic.CompletionFlags();
        this.varScanMPileup2SNPFlags = new atomic.CompletionFlags();
        this.samToolsExe = getAppPath_1.getReadable('samtools');
        if (process.platform == "linux")
            this.bowtie2Exe = getAppPath_1.getReadable('bowtie2');
        else if (process.platform == "win32")
            this.bowtie2Exe = getAppPath_1.getReadable('perl/perl/bin/perl.exe');
        this.varScanExe = getAppPath_1.getReadable("varscan.jar");
    }
    setData(data) {
        this.fasta = data.fasta;
        this.fastq1 = data.fastq1;
        this.fastq2 = data.fastq2;
        this.faiPath = fasta_1.getFaiPath(this.fasta);
        this.alignData = new alignData_1.default();
        this.alignData.type = data.type;
        this.alignData.fasta = this.fasta;
        this.alignData.fastqs.push(this.fastq1, this.fastq2);
        this.generatedArtifacts.push(`${this.fasta.path}.fai`);
        this.destinationArtifactsDirectories.push(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${this.alignData.uuid}`));
    }
    run() {
        let self = this;
        bowTie2Align_1.bowTie2Align(this).then((result) => {
            self.setSuccess(self.bowtieFlags);
            self.update();
            samToolsView_1.samToolsView(self).then((result) => {
                self.setSuccess(self.samToolsViewFlags);
                self.update();
                samToolsSort_1.samToolsSort(self).then((result) => {
                    self.setSuccess(self.samToolsIndexFlags);
                    self.update();
                    samToolsIndex_1.samToolsIndex(self).then((result) => {
                        self.setSuccess(self.samToolsIndexFlags);
                        self.update();
                        samToolsDepth_1.samToolsDepth(self).then((result) => {
                            samToolsFaidx_1.samToolsFaidx(self).then((result) => {
                                samToolsMPileup_1.samToolsMPileup(self).then((result) => {
                                    self.setSuccess(self.samToolsMPileupFlags);
                                    varScanMPileup2SNP_1.varScanMPileup2SNP(self).then((result) => {
                                        self.setSuccess(self.varScanMPileup2SNPFlags);
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
                        });
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
        });
    }
}
exports.RunAlignment = RunAlignment;
