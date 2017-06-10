"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const atomic = require("./req/operations/atomicOperations");
const GenerateQCReport_1 = require("./req/operations/GenerateQCReport");
const indexFasta_1 = require("./req/operations/indexFasta");
const RunAlignment_1 = require("./req/operations/RunAlignment");
const RenderCoverageTrack_1 = require("./req/operations/RenderCoverageTrack");
const RenderSNPTrack_1 = require("./req/operations/RenderSNPTrack");
const CheckForUpdate_1 = require("./req/operations/CheckForUpdate");
const DownloadAndInstallUpdate_1 = require("./req/operations/DownloadAndInstallUpdate");
const fastq_1 = require("./req/fastq");
const fasta_1 = require("./req/fasta");
const circularFigure_1 = require("./req/renderer/circularFigure");
const dataMgr = require("./req/main/dataMgr");
const rebuildRTDirectory_1 = require("./req/main/rebuildRTDirectory");
const getAppPath_1 = require("./req/getAppPath");
let basePath = "resources/app";
getAppPath_1.setReadableBasePath(basePath);
getAppPath_1.setWritableBasePath(basePath);
getAppPath_1.setReadableAndWritableBasePath(basePath);
rebuildRTDirectory_1.rebuildRTDirectory();
const projectManifest_1 = require("./req/projectManifest");
projectManifest_1.setManifestsPath(getAppPath_1.getReadableAndWritable(""));
const NewProject_1 = require("./req/operations/NewProject");
const OpenProject_1 = require("./req/operations/OpenProject");
const SaveCurrentProject_1 = require("./req/operations//SaveCurrentProject");
const jsonFile = require("jsonfile");
dataMgr.setKey("application", "jobErrorLog", "jobErrorLog.txt");
dataMgr.setKey("application", "jobVerboseLog", "jobVerboseLog.txt");
var assert = require("./req/tests/assert");
try {
    fs.mkdirSync("resources/app/cdata");
}
catch (err) { }
atomic.register("generateFastQCReport", GenerateQCReport_1.GenerateQCReport);
atomic.register("indexFasta", indexFasta_1.IndexFasta);
atomic.register("runAlignment", RunAlignment_1.RunAlignment);
atomic.register("renderCoverageTrackForContig", RenderCoverageTrack_1.RenderCoverageTrackForContig);
atomic.register("renderSNPTrackForContig", RenderSNPTrack_1.RenderSNPTrackForContig);
atomic.register("checkForUpdate", CheckForUpdate_1.CheckForUpdate);
atomic.register("downloadAndInstallUpdate", DownloadAndInstallUpdate_1.DownloadAndInstallUpdate);
atomic.register("newProject", NewProject_1.NewProject);
atomic.register("openProject", OpenProject_1.OpenProject);
atomic.register("saveCurrentProject", SaveCurrentProject_1.SaveCurrentProject);
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
        console.log(op);
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
atomic.updates.on("renderSNPTrackForContig", function (op) {
    if (op.flags.success) {
        console.log("rendered");
        console.log(op.circularFigure);
    }
    if (op.flags.failure) {
        console.log(op);
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
atomic.updates.on("newProject", function (op) {
    if (op.flags.done)
        assert.runningEvents -= 1;
});
atomic.updates.on("openProject", function (op) {
    if (op.flags.done)
        assert.runningEvents -= 1;
    if (op.flags.failure) {
        console.log(op.extraData);
        process.exit(1);
    }
});
atomic.updates.on("saveCurrentProject", function (op) {
    if (op.flags.done)
        assert.runningEvents -= 1;
    if (op.flags.failure) {
        console.log(op.extraData);
        process.exit(1);
    }
});
function fastQReportGeneration() {
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
}
function indexHPV16() {
    assert.assert(function () {
        assert.runningEvents += 1;
        console.log(`Starting to index ${hpv16.path}`);
        atomic.addOperation("indexFasta", hpv16);
        return true;
    }, '', 0);
}
function indexHPV18() {
    assert.assert(function () {
        assert.runningEvents += 1;
        console.log(`Starting to index ${hpv18.path}`);
        atomic.addOperation("indexFasta", hpv18);
        return true;
    }, '', 0);
}
function validateHPV16Index() {
    assert.assert(function () {
        return hpv16.indexed;
    }, 'HPV16 was indexed', 0);
    assert.assert(function () {
        return hpv16.contigs.length == 1 ? true : false;
    }, 'HPV16 has 1 contig', 0);
    assert.assert(function () {
        return hpv16.contigs[0].bp == 7906 ? true : false;
    }, 'HPV16 has correct number of base pairs', 0);
}
function validateHPV18Index() {
    assert.assert(function () {
        return hpv18.indexed;
    }, 'HPV18 was indexed', 0);
    assert.assert(function () {
        return hpv18.contigs.length == 1 ? true : false;
    }, 'HPV18 has 1 contig', 0);
    assert.assert(function () {
        return hpv18.contigs[0].bp == 7857 ? true : false;
    }, 'HPV18 has correct number of base pairs', 0);
}
function alignR1ToHPV16() {
    assert.assert(function () {
        console.log("aligning L6R1.R1, L6R1.R2 against HPV16");
        atomic.addOperation("runAlignment", { fasta: hpv16, fastq1: L6R1R1, fastq2: L6R1R2, type: "patho" });
        assert.runningEvents += 1;
        return true;
    }, '', 0);
}
function alignR1ToHPV18() {
    assert.assert(function () {
        console.log("aligning L6R1.R1, L6R1.R2 against HPV18");
        atomic.addOperation("runAlignment", { fasta: hpv18, fastq1: L6R1R1, fastq2: L6R1R2, type: "patho" });
        assert.runningEvents += 1;
        return true;
    }, '', 0);
}
function validateR1ToHPV16Alignment() {
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
        return L6R1HPV16Alignment.varScanSNPSummary.minCoverage == 8 ? true : false;
    }, 'Alignment has correct minimum coverage', 0);
    assert.assert(function () {
        return L6R1HPV16Alignment.varScanSNPSummary.minVarFreq == 0.2 ? true : false;
    }, 'Alignment has correct minimum variable frequency', 0);
    assert.assert(function () {
        return L6R1HPV16Alignment.varScanSNPSummary.minAvgQual == 15 ? true : false;
    }, 'Alignment has correct minimum average quality', 0);
    assert.assert(function () {
        return L6R1HPV16Alignment.varScanSNPSummary.pValueThresh == 0.01 ? true : false;
    }, 'Alignment has correct p-value threshold', 0);
    assert.assert(function () {
        return L6R1HPV16Alignment.varScanSNPSummary.SNPsReported == 8 ? true : false;
    }, 'Alignment has correct predicted SNPs', 0);
    assert.assert(function () {
        return L6R1HPV16Alignment.varScanSNPSummary.indelsReported == 0 ? true : false;
    }, 'Alignment has correct predicted indels', 0);
}
function validateR1ToHPV18Alignment() {
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
        return L6R1HPV18Alignment.varScanSNPSummary.minCoverage == 8 ? true : false;
    }, 'Alignment has correct minimum coverage', 0);
    assert.assert(function () {
        return L6R1HPV18Alignment.varScanSNPSummary.minVarFreq == 0.2 ? true : false;
    }, 'Alignment has correct minimum variable frequency', 0);
    assert.assert(function () {
        return L6R1HPV18Alignment.varScanSNPSummary.minAvgQual == 15 ? true : false;
    }, 'Alignment has correct minimum average quality', 0);
    assert.assert(function () {
        return L6R1HPV18Alignment.varScanSNPSummary.pValueThresh == 0.01 ? true : false;
    }, 'Alignment has correct p-value threshold', 0);
    assert.assert(function () {
        return L6R1HPV18Alignment.varScanSNPSummary.SNPsReported == 0 ? true : false;
    }, 'Alignment has correct predicted SNPs', 0);
    assert.assert(function () {
        return L6R1HPV18Alignment.varScanSNPSummary.indelsReported == 0 ? true : false;
    }, 'Alignment has correct predicted indels', 0);
}
function renderHPV16FigureTracks() {
    assert.assert(function () {
        hpv16Figure = new circularFigure_1.CircularFigure("HPV16 Figure", hpv16.uuid, hpv16.contigs);
        atomic.addOperation("renderCoverageTrackForContig", { circularFigure: hpv16Figure, contiguuid: hpv16Figure.contigs[0].uuid, alignData: L6R1HPV16Alignment });
        assert.runningEvents += 1;
        return true;
    }, '', 0);
    assert.assert(function () {
        return true;
    }, '--------------------------------------------------------', 0);
    assert.assert(function () {
        atomic.addOperation("renderSNPTrackForContig", { circularFigure: hpv16Figure, contiguuid: hpv16Figure.contigs[0].uuid, alignData: L6R1HPV16Alignment });
        assert.runningEvents += 1;
        return true;
    }, '', 0);
    assert.assert(function () {
        return true;
    }, '--------------------------------------------------------', 0);
}
setInterval(function () { atomic.runOperations(1); }, 1000);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    atomic.addOperation("newProject", "Test Project1");
    return true;
}, '', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    let projectManifest = jsonFile.readFileSync(projectManifest_1.getProjectManifests());
    if (!projectManifest) {
        return false;
    }
    atomic.addOperation("openProject", projectManifest[0]);
    return true;
}, '', 0);
fastQReportGeneration();
indexHPV16();
validateHPV16Index();
indexHPV18();
validateHPV18Index();
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
alignR1ToHPV16();
validateR1ToHPV16Alignment();
alignR1ToHPV18();
validateR1ToHPV18Alignment();
assert.assert(function () {
    assert.runningEvents += 1;
    let projectManifest = jsonFile.readFileSync(projectManifest_1.getProjectManifests());
    if (!projectManifest) {
        return false;
    }
    atomic.addOperation("saveCurrentProject", projectManifest[0]);
    return true;
}, '', 0);
assert.assert(function () {
    return true;
}, '--------------------------------------------------------', 0);
assert.assert(function () {
    assert.runningEvents += 1;
    let projectManifest = jsonFile.readFileSync(projectManifest_1.getProjectManifests());
    if (!projectManifest) {
        return false;
    }
    atomic.addOperation("openProject", projectManifest[0]);
    return true;
}, '', 0);
validateHPV16Index();
validateHPV18Index();
validateR1ToHPV16Alignment();
validateR1ToHPV18Alignment();
renderHPV16FigureTracks();
assert.runAsserts();
