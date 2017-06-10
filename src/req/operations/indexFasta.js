"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const atomic = require("./atomicOperations");
const fasta_1 = require("./../fasta");
const fastaContigLoader_1 = require("./../fastaContigLoader");
const getAppPath_1 = require("./../getAppPath");
const bowTie2Build_1 = require("./indexFasta/bowTie2Build");
const faToTwoBit_1 = require("./indexFasta/faToTwoBit");
const samToolsFaidx_1 = require("./indexFasta/samToolsFaidx");
class IndexFasta extends atomic.AtomicOperation {
    constructor() {
        super();
        this.twoBitFlags = new atomic.CompletionFlags();
        this.faiFlags = new atomic.CompletionFlags();
        this.bowtieFlags = new atomic.CompletionFlags();
        this.bowtieIndices = new Array();
        this.bowtieSizeThreshold = 4294967096;
        this.faToTwoBitExe = getAppPath_1.getReadable('faToTwoBit');
        this.samToolsExe = getAppPath_1.getReadable('samtools');
        if (process.platform == "linux")
            this.bowtie2BuildExe = getAppPath_1.getReadable('bowtie2-build');
        else if (process.platform == "win32")
            this.bowtie2BuildExe = getAppPath_1.getReadable('python/python.exe');
    }
    setData(data) {
        this.fasta = data;
        this.twoBitPath = fasta_1.get2BitPath(this.fasta);
        this.destinationArtifacts.push(this.twoBitPath);
        this.faiPath = fasta_1.getFaiPath(this.fasta);
        this.destinationArtifacts.push(this.faiPath);
        this.generatedArtifacts.push(`${this.fasta.path}.fai`);
        this.bowTieIndexPath = getAppPath_1.getReadableAndWritable(`rt/indexes/${this.fasta.uuid}`);
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
        faToTwoBit_1.faToTwoBit(self).then((result) => {
            self.setSuccess(self.twoBitFlags);
            self.update();
            samToolsFaidx_1.samToolsFaidx(self).then((result) => {
                self.setSuccess(self.faiFlags);
                self.update();
                bowTie2Build_1.bowTie2Build(self).then((result) => {
                    self.setSuccess(self.bowtieFlags);
                    self.update();
                    let contigLoader = new fastaContigLoader_1.FastaContigLoader();
                    contigLoader.on("doneLoadingContigs", function () {
                        self.fasta.contigs = contigLoader.contigs;
                        self.setSuccess(self.flags);
                        self.fasta.indexed = true;
                        self.update();
                    });
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
    }
}
exports.IndexFasta = IndexFasta;
