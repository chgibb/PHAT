"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
const varScanMPileup2SNPReportParser_1 = require("./../../varScanMPileup2SNPReportParser");
function varScanMPileup2SNP(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.unBufferedData) {
                    if (params.stdout) {
                        op.varScanMPileup2SNPStdOutStream.write(params.unBufferedData);
                    }
                    else if (params.stderr) {
                        op.alignData.varScanSNPReport += params.unBufferedData;
                    }
                }
                else if (params.done && params.retCode !== undefined) {
                    if (params.retCode == 0) {
                        setTimeout(function () {
                            op.varScanMPileup2SNPStdOutStream.end();
                            op.alignData.varScanSNPSummary = varScanMPileup2SNPReportParser_1.varScanMPileup2SNPReportParser(op.alignData.varScanSNPReport);
                            resolve();
                        }, 500);
                    }
                    else {
                        reject(`Failed to predict SNPs for ${op.alignData.alias}`);
                    }
                }
            }
        };
        op.varScanMPileup2SNPJob = new Job_1.Job("java", [
            "-jar",
            op.varScanExe,
            "mpileup2snp",
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/pileup.mpileup`)
        ], "", true, jobCallBack, {});
        try {
            op.varScanMPileup2SNPJob.Run();
        }
        catch (err) {
            return reject(err);
        }
        op.varScanMPileup2SNPStdOutStream = fs.createWriteStream(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/snps.vcf`));
    });
}
exports.varScanMPileup2SNP = varScanMPileup2SNP;
