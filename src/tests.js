"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const atomic = require("./req/operations/atomicOperations");
const GenerateQCReport_1 = require("./req/operations/GenerateQCReport");
const indexFasta_1 = require("./req/operations/indexFasta");
const RunAlignment_1 = require("./req/operations/RunAlignment");
const RenderCoverageTrack_1 = require("./req/operations/RenderCoverageTrack");
const CheckForUpdate_1 = require("./req/operations/CheckForUpdate");
const DownloadAndInstallUpdate_1 = require("./req/operations/DownloadAndInstallUpdate");
const fastq_1 = require("./req/fastq");
const fasta_1 = require("./req/fasta");
const circularFigure_1 = require("./req/renderer/circularFigure");
var assert = require("./req/tests/assert");
try {
    fs.mkdirSync("resources/app/cdata");
}
catch (err) { }
try {
    fs.mkdirSync("resources/app/rt");
    fs.mkdirSync("resources/app/rt/QCReports");
    fs.mkdirSync("resources/app/rt/indexes");
    fs.mkdirSync("resources/app/rt/AlignmentArtifacts");
    fs.mkdirSync("resources/app/rt/circularFigures");
}
catch (err) { }
atomic.register("generateFastQCReport", GenerateQCReport_1.GenerateQCReport);
atomic.register("indexFasta", indexFasta_1.IndexFasta);
atomic.register("runAlignment", RunAlignment_1.RunAlignment);
atomic.register("renderCoverageTrackForContig", RenderCoverageTrack_1.RenderCoverageTrackForContig);
atomic.register("checkForUpdate", CheckForUpdate_1.CheckForUpdate);
atomic.register("downloadAndInstallUpdate", DownloadAndInstallUpdate_1.DownloadAndInstallUpdate);
let L6R1R1 = new fastq_1.default('data/L6R1.R1.fastq');
let L6R1R2 = new fastq_1.default('data/L6R1.R2.fastq');
let hpv16 = new fasta_1.Fasta("data/HPV16ref_genomes.fasta");
let hpv18 = new fasta_1.Fasta("data/HPV18ref_genomes.fasta");
let L6R1HPV16Alignment;
let L6R1HPV18Alignment;
let hpv16Figure;
atomic.updates.on("generateFastQCReport", function (op) {
    if (op.flags.failure) {
        console.log(`Failed generating QC report for ${op.fastq.path}
				${op.extraData}`);
    }
    else if (op.flags.success) {
        console.log(`Completed generating QC report for ${op.fastq.path}`);
    }
    if (op.flags.done)
        assert.runningEvents -= 1;
});
atomic.updates.on("indexFasta", function (op) {
    if (op.flags.failure) {
        console.log(`Failed indexing ${op.fasta.path}
				${op.extraData}`);
    }
    else if (op.flags.success) {
        console.log(`Completed indexing ${op.fasta.path}`);
    }
    if (op.flags.done)
        assert.runningEvents -= 1;
});
atomic.updates.on("runAlignment", function (op) {
    if (op.flags.failure) {
        console.log(`Failed aligning ${op.fastq1.alias} ${op.fastq2.alias} against ${op.fasta.alias}`);
    }
    else if (op.flags.success) {
        console.log(`Completed aligning ${op.fastq1.alias} ${op.fastq2.alias} against ${op.fasta.alias}`);
        if (op.fasta.uuid == hpv16.uuid)
            L6R1HPV16Alignment = op.alignData;
        if (op.fasta.uuid == hpv18.uuid)
            L6R1HPV18Alignment = op.alignData;
    }
    if (op.flags.done)
        assert.runningEvents -= 1;
});
atomic.updates.on("renderCoverageTrackForContig", function (op) {
    if (op.flags.success) {
        console.log("rendered");
        console.log(op.circularFigure);
    }
    if (op.flags.failure) {
        console.log(op.extraData);
    }
    if (op.flags.done)
        assert.runningEvents -= 1;
});
atomic.updates.on("checkForUpdate", function (op) {
    if (op.flags.done) {
        if (op.flags.success) {
            if (op.extraData.status == 0) {
                console.log(JSON.stringify(op.extraData.asset, undefined, 4));
                atomic.addOperation("downloadAndInstallUpdate", {
                    asset: op.extraData.asset,
                    token: op.token
                });
            }
        }
        if (op.flags.failure)
            console.log("failed to check");
        console.log(op);
    }
});
atomic.updates.on("downloadAndInstallUpdate", function (op) {
    if (op.extraData)
        console.log(op.extraData);
    if (op.flags.done) {
        assert.runningEvents -= 1;
    }
});
setInterval(function () { atomic.runOperations(1); }, 1000);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    console.log(`Starting report generation for ${L6R1R1.path}`);
    atomic.addOperation("generateFastQCReport", L6R1R1);
    return true;
}, '', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    console.log(`Starting report generation for ${L6R1R2.path}`);
    atomic.addOperation("generateFastQCReport", L6R1R2);
    return true;
}, '', 0);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    console.log(`Starting to index ${hpv16.path}`);
    atomic.addOperation("indexFasta", hpv16);
    return true;
}, '', 0);
assert.assert(function () {
    return hpv16.indexed;
}, 'HPV16 was indexed', 0);
assert.assert(function () {
    return hpv16.contigs.length == 1 ? true : false;
}, 'HPV16 has 1 contig', 0);
assert.assert(function () {
    return hpv16.contigs[0].bp == 7906 ? true : false;
}, 'HPV16 has correct number of base pairs', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    console.log(`Starting to index ${hpv18.path}`);
    atomic.addOperation("indexFasta", hpv18);
    return true;
}, '', 0);
assert.assert(function () {
    return hpv18.indexed;
}, 'HPV18 was indexed', 0);
assert.assert(function () {
    return hpv18.contigs.length == 1 ? true : false;
}, 'HPV18 has 1 contig', 0);
assert.assert(function () {
    return hpv18.contigs[0].bp == 7857 ? true : false;
}, 'HPV18 has correct number of base pairs', 0);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.assert(function () {
    console.log("aligning L6R1.R1, L6R1.R2 against HPV16");
    atomic.addOperation("runAlignment", { fasta: hpv16, fastq1: L6R1R1, fastq2: L6R1R2, type: "patho" });
    assert.runningEvents += 1;
    return true;
}, '', 0);
assert.assert(function () {
    return L6R1HPV16Alignment.summary.reads == 2689 ? true : false;
}, 'Alignment has correct number of reads', 0);
assert.assert(function () {
    return L6R1HPV16Alignment.summary.mates == 4696 ? true : false;
}, 'Alignment has correct number of mates', 0);
assert.assert(function () {
    return L6R1HPV16Alignment.summary.overallAlignmentRate == 12.96 ? true : false;
}, 'Alignment has correct alignment rate	', 0);
assert.assert(function () {
    console.log("aligning L6R1.R1, L6R1.R2 against HPV18");
    atomic.addOperation("runAlignment", { fasta: hpv18, fastq1: L6R1R1, fastq2: L6R1R2, type: "patho" });
    assert.runningEvents += 1;
    return true;
}, '', 0);
assert.assert(function () {
    return L6R1HPV18Alignment.summary.reads == 2689 ? true : false;
}, 'Alignment has correct number of reads', 0);
assert.assert(function () {
    return L6R1HPV18Alignment.summary.mates == 5378 ? true : false;
}, 'Alignment has correct number of mates', 0);
assert.assert(function () {
    return L6R1HPV18Alignment.summary.overallAlignmentRate == 0 ? true : false;
}, 'Alignment has correct alignment rate	', 0);
assert.assert(function () {
    hpv16Figure = new circularFigure_1.CircularFigure("HPV16 Figure", hpv16.uuid, hpv16.contigs);
    atomic.addOperation("renderCoverageTrackForContig", { circularFigure: hpv16Figure, contiguuid: hpv16Figure.contigs[0].uuid, alignData: L6R1HPV16Alignment });
    assert.runningEvents += 1;
    return true;
}, '', 0);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.runAsserts();
