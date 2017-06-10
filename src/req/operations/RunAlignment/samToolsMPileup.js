"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
function samToolsMPileup(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.processName == op.samToolsExe && params.args[0] == "mpileup") {
                    if (params.unBufferedData && params.stdout) {
                        op.samToolsMPileupStream.write(params.unBufferedData);
                    }
                    else if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            setTimeout(function () {
                                op.samToolsMPileupStream.end();
                                resolve();
                            }, 500);
                        }
                        else {
                            reject(`Failed to generate pileup for ${op.alignData.alias}`);
                        }
                    }
                }
            }
        };
        op.samToolsMPileupJob = new Job_1.Job(op.samToolsExe, [
            "mpileup",
            "-f",
            op.fasta.path,
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`)
        ], "", true, jobCallBack, {});
        try {
            op.samToolsMPileupJob.Run();
        }
        catch (err) {
            return reject(err);
        }
        op.samToolsMPileupStream = fs.createWriteStream(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/pileup.mpileup`));
    });
}
exports.samToolsMPileup = samToolsMPileup;
