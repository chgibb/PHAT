"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
function bowTie2Build(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.done && params.retCode !== undefined) {
                    if (params.retCode == 0) {
                        setTimeout(function () {
                            try {
                                for (let i = 0; i != op.bowtieIndices.length; ++i) {
                                    fs.accessSync(`${op.bowtieIndices[i]}`, fs.constants.F_OK | fs.constants.R_OK);
                                }
                            }
                            catch (err) {
                                reject(`Failed to write all bowtie2 indices for ${op.fasta.alias}`);
                            }
                            resolve();
                        }, 5000);
                    }
                }
            }
        };
        let bowTieArgs = new Array();
        if (process.platform == "linux")
            bowTieArgs = [op.fasta.path, op.bowTieIndexPath];
        else if (process.platform == "win32") {
            bowTieArgs = [
                getAppPath_1.getReadable(`bowtie2-build`),
                `"${op.fasta.path}"`,
                `"${op.bowTieIndexPath}"`
            ];
        }
        op.bowtieJob = new Job_1.Job(op.bowtie2BuildExe, bowTieArgs, "", true, jobCallBack, {});
        try {
            op.bowtieJob.Run();
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.bowTie2Build = bowTie2Build;
