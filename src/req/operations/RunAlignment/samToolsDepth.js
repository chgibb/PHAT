"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
function samToolsDepth(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.processName == op.samToolsExe && params.args[0] == "depth") {
                    if (params.unBufferedData) {
                        op.samToolsCoverageFileStream.write(params.unBufferedData);
                    }
                    else if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            setTimeout(function () {
                                op.samToolsCoverageFileStream.end();
                                let rl = readline.createInterface({
                                    input: fs.createReadStream(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/depth.coverage`))
                                });
                                rl.on("line", function (line) {
                                    let coverageTokens = line.split(/\s/g);
                                    for (let i = 0; i != op.fasta.contigs.length; ++i) {
                                        let contigTokens = op.fasta.contigs[i].name.split(/\s/g);
                                        for (let k = 0; k != coverageTokens.length; ++k) {
                                            if (coverageTokens[k] == contigTokens[0]) {
                                                fs.appendFileSync(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/contigCoverage/${op.fasta.contigs[i].uuid}`), `${coverageTokens[k + 1]} ${coverageTokens[k + 2]}\n`);
                                            }
                                        }
                                    }
                                });
                                rl.on("close", function () {
                                    resolve();
                                });
                            }, 500);
                        }
                        else {
                            reject(`Failed to get depth for ${op.alignData.alias}`);
                        }
                    }
                }
            }
        };
        op.samToolsDepthJob = new Job_1.Job(op.samToolsExe, [
            "depth",
            getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`)
        ], "", true, jobCallBack, {});
        try {
            op.samToolsDepthJob.Run();
        }
        catch (err) {
            return reject(err);
        }
        op.samToolsCoverageFileStream = fs.createWriteStream(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/depth.coverage`));
    });
}
exports.samToolsDepth = samToolsDepth;
