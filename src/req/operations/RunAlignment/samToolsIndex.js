"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
function samToolsIndex(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.processName == op.samToolsExe && params.args[0] == "index") {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            return resolve();
                        }
                    }
                }
                else {
                    return reject(`Failed to index bam for ${op.alignData.alias}`);
                }
            }
        };
        op.samToolsIndexJob = new Job_1.Job(op.samToolsExe, [
            "index",
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`),
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam.bai`)
        ], "", true, jobCallBack, {});
        try {
            op.samToolsIndexJob.Run();
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.samToolsIndex = samToolsIndex;
