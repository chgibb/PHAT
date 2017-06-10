"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Job_1 = require("./../../main/Job");
function faToTwoBit(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.done && params.retCode !== undefined) {
                    if (params.retCode == 0) {
                        return resolve();
                    }
                    else {
                        return reject(`Failed to create 2bit index for ${op.fasta.alias}`);
                    }
                }
            }
        };
        op.twoBitJob = new Job_1.Job(op.faToTwoBitExe, [
            op.fasta.path,
            op.twoBitPath
        ], "", true, jobCallBack, {});
        try {
            op.twoBitJob.Run();
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.faToTwoBit = faToTwoBit;
