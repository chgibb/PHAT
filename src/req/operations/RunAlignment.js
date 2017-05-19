"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const atomic = require("./atomicOperations");
const alignData_1 = require("./../alignData");
const Job_1 = require("./../main/Job");
const bowTie2AlignmentReportParser_1 = require("./../bowTie2AlignmentReportParser");
class RunAlignment extends atomic.AtomicOperation {
    constructor() {
        super();
        this.bowtieFlags = new atomic.CompletionFlags();
        this.samToolsIndexFlags = new atomic.CompletionFlags();
        this.samToolsSortFlags = new atomic.CompletionFlags();
        this.samToolsViewFlags = new atomic.CompletionFlags();
        this.samToolsDepthFlags = new atomic.CompletionFlags();
        this.samToolsExe = 'resources/app/samtools';
        if (process.platform == "linux")
            this.bowtie2Exe = 'resources/app/bowtie2';
        else if (process.platform == "win32")
            this.bowtie2Exe = 'resources/app/perl/perl/bin/perl.exe';
    }
    setData(data) {
        this.fasta = data.fasta;
        this.fastq1 = data.fastq1;
        this.fastq2 = data.fastq2;
        this.alignData = new alignData_1.default();
        this.alignData.type = data.type;
        this.alignData.fasta = this.fasta;
        this.alignData.fastqs.push(this.fastq1, this.fastq2);
        this.destinationArtifactsDirectories.push(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}`);
    }
    run() {
        let self = this;
        let jobCallBack = {
            send(channel, params) {
                if (self.flags.done)
                    return;
                if (params.processName == self.bowtie2Exe) {
                    if (params.unBufferedData)
                        self.alignData.summaryText += params.unBufferedData;
                    self.spawnUpdate = params;
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.bowtieFlags);
                            setTimeout(function () {
                                self.alignData.summary = bowTie2AlignmentReportParser_1.parseBowTie2AlignmentReport(self.alignData.summaryText);
                                self.samToolsViewJob = new Job_1.Job(self.samToolsExe, [
                                    "view",
                                    "-bS",
                                    `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sam`,
                                    "-o",
                                    `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.bam`,
                                ], "", true, jobCallBack, {});
                                try {
                                    self.samToolsViewJob.Run();
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(err);
                                    return;
                                }
                            }, 500);
                        }
                        else {
                            self.abortOperationWithMessage(params.unBufferedData);
                            self.update();
                        }
                    }
                }
                if (params.processName == self.samToolsExe && params.args[0] == "view") {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.samToolsViewFlags);
                            setTimeout(function () {
                                let input = `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.bam`;
                                let output;
                                if (process.platform == "win32")
                                    output = `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted`;
                                else if (process.platform == "linux")
                                    output = `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam`;
                                let args = new Array();
                                if (process.platform == "linux") {
                                    args = [
                                        "sort",
                                        input,
                                        "-o",
                                        output
                                    ];
                                }
                                else if (process.platform == "win32") {
                                    args = [
                                        "sort",
                                        input,
                                        output
                                    ];
                                }
                                self.samToolsSortJob = new Job_1.Job(self.samToolsExe, args, "", true, jobCallBack, {});
                                try {
                                    self.samToolsSortJob.Run();
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(err);
                                    return;
                                }
                            }, 500);
                        }
                        else {
                            self.abortOperationWithMessage(params.unBufferedData);
                            self.update();
                        }
                    }
                }
                if (params.processName == self.samToolsExe && params.args[0] == "sort") {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.samToolsSortFlags);
                            setTimeout(function () {
                                self.samToolsIndexJob = new Job_1.Job(self.samToolsExe, [
                                    "index",
                                    `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam`,
                                    `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam.bai`
                                ], "", true, jobCallBack, {});
                                try {
                                    self.samToolsIndexJob.Run();
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(err);
                                    return;
                                }
                            }, 500);
                        }
                        else {
                            self.abortOperationWithMessage(`Failed to sort bam for ${self.alignData.alias}`);
                            self.update();
                            return;
                        }
                    }
                }
                if (params.processName == self.samToolsExe && params.args[0] == "index") {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.samToolsIndexFlags);
                            setTimeout(function () {
                                self.samToolsDepthJob = new Job_1.Job(self.samToolsExe, [
                                    "depth",
                                    `resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/out.sorted.bam`
                                ], "", true, jobCallBack, {});
                                try {
                                    self.samToolsDepthJob.Run();
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(err);
                                    return;
                                }
                                self.samToolsCoverageFileStream = fs.createWriteStream(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/depth.coverage`);
                            }, 500);
                        }
                        else {
                            self.abortOperationWithMessage(`Failed to index bam for ${self.alignData.alias}`);
                            self.update();
                            return;
                        }
                    }
                }
                if (params.processName == self.samToolsExe && params.args[0] == "depth") {
                    if (params.unBufferedData) {
                        self.samToolsCoverageFileStream.write(params.unBufferedData);
                    }
                    else if (params.done && params.retCode !== undefined) {
                        setTimeout(function () {
                            self.samToolsCoverageFileStream.end();
                            let rl = readline.createInterface({
                                input: fs.createReadStream(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/depth.coverage`)
                            });
                            rl.on("line", function (line) {
                                let coverageTokens = line.split(/\s/g);
                                for (let i = 0; i != self.fasta.contigs.length; ++i) {
                                    let contigTokens = self.fasta.contigs[i].name.split(/\s/g);
                                    for (let k = 0; k != coverageTokens.length; ++k) {
                                        if (coverageTokens[k] == contigTokens[0]) {
                                            fs.appendFileSync(`resources/app/rt/AlignmentArtifacts/${self.alignData.uuid}/contigCoverage/${self.fasta.contigs[i].uuid}`, `${coverageTokens[k + 1]} ${coverageTokens[k + 2]}\n`);
                                        }
                                    }
                                }
                            });
                            rl.on("close", function () {
                                self.setSuccess(self.samToolsDepthFlags);
                                self.setSuccess(self.flags);
                                self.update();
                            });
                        }, 500);
                    }
                    else {
                        self.abortOperationWithMessage(`Failed to get depth for ${self.alignData.alias}`);
                        self.update();
                        self.samToolsCoverageFileStream.end();
                        return;
                    }
                }
                self.update();
            }
        };
        let args = new Array();
        if (process.platform == "win32")
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
        for (let i = 0; i != args.length; ++i) {
            invokeString += args[i];
            invokeString += " ";
        }
        this.alignData.invokeString = invokeString;
        this.alignData.alias = `${this.fastq1.alias}, ${this.fastq2.alias}; ${this.fasta.alias}`;
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}`);
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}/contigCoverage`);
        this.bowtieJob = new Job_1.Job(this.bowtie2Exe, args, "", true, jobCallBack, {});
        try {
            this.bowtieJob.Run();
        }
        catch (err) {
            this.abortOperationWithMessage(err);
            return;
        }
        this.update();
    }
}
exports.RunAlignment = RunAlignment;
