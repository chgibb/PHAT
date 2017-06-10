"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const Job_1 = require("./../../main/Job");
function samToolsFaidx(op) {
    return new Promise((resolve, reject) => {
        let jobCallBack = {
            send(channel, params) {
                if (params.done && params.retCode !== undefined) {
                    if (params.retCode == 0) {
                        setTimeout(function () {
                            try {
                                fse.copy(`${op.fasta.path}.fai`, op.faiPath, function (err) {
                                    if (err)
                                        reject(err);
                                    resolve();
                                });
                            }
                            catch (err) {
                                return reject(err);
                            }
                        }, 1000);
                    }
                    else {
                        return reject(`Failed to create fai index for ${op.fasta.alias}`);
                    }
                }
            }
        };
        op.faiJob = new Job_1.Job(op.samToolsExe, [
            "faidx",
            op.fasta.path
        ], "", true, jobCallBack, {});
        try {
            op.faiJob.Run();
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.samToolsFaidx = samToolsFaidx;
