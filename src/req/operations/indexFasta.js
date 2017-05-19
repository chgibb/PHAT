"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fse = require("fs-extra");
const atomic = require("./atomicOperations");
const fastaContigLoader_1 = require("./../fastaContigLoader");
const Job_1 = require("./../main/Job");
class IndexFasta extends atomic.AtomicOperation {
    constructor() {
        super();
        this.twoBitFlags = new atomic.CompletionFlags();
        this.faiFlags = new atomic.CompletionFlags();
        this.bowtieFlags = new atomic.CompletionFlags();
        this.bowtieIndices = new Array();
        this.bowtieSizeThreshold = 4294967096;
        this.faToTwoBitExe = 'resources/app/faToTwoBit';
        this.samToolsExe = 'resources/app/samtools';
        if (process.platform == "linux")
            this.bowtie2BuildExe = 'resources/app/bowtie2-build';
        else if (process.platform == "win32")
            this.bowtie2BuildExe = 'resources/app/python/python.exe';
    }
    setData(data) {
        this.fasta = data;
        this.twoBitPath = `resources/app/rt/indexes/${this.fasta.uuid}.2bit`;
        this.destinationArtifacts.push(this.twoBitPath);
        this.fasta.twoBit = this.twoBitPath;
        this.faiPath = `resources/app/rt/indexes/${this.fasta.uuid}.fai`;
        this.destinationArtifacts.push(this.faiPath);
        this.fasta.fai = this.faiPath;
        this.generatedArtifacts.push(`${this.fasta.path}.fai`);
        this.bowTieIndexPath = `resources/app/rt/indexes/${this.fasta.uuid}`;
        let x64 = (this.fasta.size > this.bowtieSizeThreshold ? "1" : "");
        this.bowtieIndices.push(`${this.bowTieIndexPath}.1.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.2.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.3.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.4.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.rev.1.bt2${x64}`);
        this.bowtieIndices.push(`${this.bowTieIndexPath}.rev.2.bt2${x64}`);
        this.destinationArtifacts.concat(this.bowtieIndices);
    }
    run() {
        let self = this;
        let jobCallBack = {
            send(channel, params) {
                if (self.flags.done)
                    return;
                if (params.processName == self.faToTwoBitExe) {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.twoBitFlags);
                            self.faiJob = new Job_1.Job(self.samToolsExe, ["faidx", self.fasta.path], "", true, jobCallBack, {});
                            try {
                                self.faiJob.Run();
                            }
                            catch (err) {
                                self.abortOperationWithMessage(err);
                                return;
                            }
                            self.spawnUpdate = params;
                            self.update();
                        }
                        else {
                            self.abortOperationWithMessage(`Failed to create 2bit index for ${self.fasta.uuid}`);
                            return;
                        }
                    }
                }
                if (params.processName == self.samToolsExe) {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.faiFlags);
                            setTimeout(function () {
                                try {
                                    fse.copySync(`${self.fasta.path}.fai`, self.faiPath);
                                    self.setSuccess(self.faiFlags);
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(err);
                                    return;
                                }
                                let bowtieArgs = new Array();
                                if (process.platform == "linux")
                                    bowtieArgs = [`"${self.fasta.path}"`, `"${self.bowTieIndexPath}"`];
                                else if (process.platform == "win32")
                                    bowtieArgs = ['resources/app/bowtie2-build', `"${self.fasta.path}"`, `"${self.bowTieIndexPath}"`];
                                self.bowtieJob = new Job_1.Job(self.bowtie2BuildExe, bowtieArgs, "", true, jobCallBack, {});
                                try {
                                    self.bowtieJob.Run();
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(err);
                                    return;
                                }
                            }, 1000);
                            self.spawnUpdate = params;
                            self.update();
                        }
                        else {
                            self.abortOperationWithMessage(`Failed to create fai index for ${self.fasta.uuid}`);
                            return;
                        }
                    }
                }
                if (params.processName == self.bowtie2BuildExe) {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            self.setSuccess(self.bowtieFlags);
                            setTimeout(function () {
                                try {
                                    for (let i = 0; i != self.bowtieIndices.length; ++i) {
                                        fs.accessSync(self.bowtieIndices[i], fs.constants.F_OK | fs.constants.R_OK);
                                    }
                                }
                                catch (err) {
                                    self.abortOperationWithMessage(`Failed to write all bowtie2 indices for ${self.fasta.uuid}`);
                                    return;
                                }
                                self.fasta.indexed = true;
                                let contigLoader = new fastaContigLoader_1.FastaContigLoader();
                                contigLoader.on("doneLoadingContigs", function () {
                                    self.fasta.contigs = contigLoader.contigs;
                                    self.setSuccess(self.flags);
                                    self.spawnUpdate = params;
                                    self.update();
                                });
                                contigLoader.beginRefStream(self.fasta.path);
                            }, 5000);
                        }
                        else {
                            self.abortOperationWithMessage(`Failed to create bowtie2 index for ${self.fasta.uuid}`);
                            return;
                        }
                    }
                }
            }
        };
        this.twoBitJob = new Job_1.Job(this.faToTwoBitExe, [this.fasta.path, this.twoBitPath], "", true, jobCallBack, {});
        try {
            this.twoBitJob.Run();
        }
        catch (err) {
            this.abortOperationWithMessage(err);
            return;
        }
        this.update();
    }
}
exports.IndexFasta = IndexFasta;
