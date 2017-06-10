"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
const bowTie2AlignmentReportParser_1 = require("./../../bowTie2AlignmentReportParser");
function samToolsView(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.processName == op.samToolsExe && params.args[0] == "view") {
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            resolve();
                        }
                        else {
                            return reject(params.unBufferedData);
                        }
                    }
                }
            }
        };
        op.alignData.summary = bowTie2AlignmentReportParser_1.parseBowTie2AlignmentReport(op.alignData.summaryText);
        op.samToolsViewJob = new Job_1.Job(op.samToolsExe, [
            "view",
            "-bS",
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sam`),
            "-o",
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.bam`),
        ], "", true, jobCallBack, {});
        try {
            op.samToolsViewJob.Run();
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.samToolsView = samToolsView;
