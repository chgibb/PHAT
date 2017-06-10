"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const getAppPath_1 = require("./../../getAppPath");
const Job_1 = require("./../../main/Job");
function bowTie2Align(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.processName == op.bowtie2Exe) {
                    if (params.unBufferedData)
                        op.alignData.summaryText += params.unBufferedData;
                    op.spawnUpdate = params;
                    if (params.done && params.retCode !== undefined) {
                        if (params.retCode == 0) {
                            return resolve();
                        }
                        else {
                            return reject(params.unBufferedData);
                        }
                    }
                }
            }
        };
        let args = new Array();
        if (process.platform == "win32")
            args.push(getAppPath_1.getReadable("bowtie2"));
        args.push("-x");
        args.push(getAppPath_1.getReadableAndWritable(`rt/indexes/${op.fasta.uuid}`));
        if (op.fastq2 !== undefined) {
            args.push("-1");
            args.push(op.fastq1.path);
            args.push("-2");
            args.push(op.fastq2.path);
        }
        else {
            args.push("-U");
            args.push(op.fastq1.path);
        }
        args.push("-S");
        args.push(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sam`));
        let invokeString = "";
        for (let i = 0; i != args.length; ++i) {
            invokeString += args[i];
            invokeString += " ";
        }
        op.alignData.invokeString = invokeString;
        if (op.fastq2 !== undefined)
            op.alignData.alias = `${op.fastq1.alias}, ${op.fastq2.alias}; ${op.fasta.alias}`;
        else
            op.alignData.alias = `${op.fastq1.alias}; ${op.fasta.alias}`;
        fs.mkdirSync(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}`));
        fs.mkdirSync(getAppPath_1.getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/contigCoverage`));
        op.bowtieJob = new Job_1.Job(op.bowtie2Exe, args, "", true, jobCallBack, {});
        try {
            op.bowtieJob.Run();
        }
        catch (err) {
            return reject(err);
        }
        op.update();
    });
}
exports.bowTie2Align = bowTie2Align;
