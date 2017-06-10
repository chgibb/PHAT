"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
function samToolsSort(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.processName == op.samToolsExe && params.args[0] == "sort") {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            resolve();
                        }
                        else {
                            return reject(`Failed to sort bam for ${op.alignData.alias}`);
                        }
                    }
                }
            }
        };
        let input = getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.bam`);
        let output;
        output = getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`);
        let args = new Array();
        args = [
            "sort",
            input,
            "-o",
            output
        ];
        op.samToolsSortJob = new Job_1.Job(op.samToolsExe, args, "", true, jobCallBack, {});
        try {
            op.samToolsSortJob.Run();
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.samToolsSort = samToolsSort;
