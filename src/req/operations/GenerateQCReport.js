"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const atomic = require("./atomicOperations");
const QCReportSummary_1 = require("./../QCReportSummary");
const trimPath_1 = require("./../trimPath");
const Job_1 = require("./../main/Job");
class GenerateQCReport extends atomic.AtomicOperation {
    constructor() {
        super();
        this.hasJVMCrashed = false;
        this.fastQCFlags = new atomic.CompletionFlags();
    }
    setData(data) {
        this.fastq = data;
        let trimmed = trimPath_1.default(this.fastq.path);
        let remainder = this.fastq.path.substr(0, this.fastq.path.length - trimmed.length);
        trimmed = trimmed.replace(new RegExp('(.fastq)', 'g'), '_fastqc');
        this.generatedArtifactsDirectories.push(remainder + trimmed);
        this.generatedArtifacts.push(remainder + trimmed + ".zip");
        this.srcDir = remainder + trimmed;
        this.destDir = 'resources/app/rt/QCReports/' + data.uuid;
        this.destinationArtifactsDirectories.push(this.destDir);
    }
    run() {
        if (process.platform == "linux")
            this.fastQCPath = 'resources/app/FastQC/fastqc';
        else if (process.platform == "win32")
            this.fastQCPath = 'resources/app/perl/perl/bin/perl.exe';
        let args;
        if (process.platform == "linux")
            args = [this.fastq.path];
        else if (process.platform == "win32")
            args = ['resources/app/FastQC/fastqc', this.fastq.path];
        let isJVMCrashed = new RegExp("(fatal error)", "g");
        let self = this;
        let fastQCCallBack = {
            send(channel, params) {
                if (self.flags.done)
                    return;
                if (params.unBufferedData) {
                    if (isJVMCrashed.test(params.unBufferedData)) {
                        self.hasJVMCrashed = true;
                        self.abortOperationWithMessage(`JVM crashed.`);
                        return;
                    }
                }
                if (params.done && params.retCode !== undefined) {
                    if (params.retCode == 0)
                        self.setSuccess(self.fastQCFlags);
                    else {
                        self.abortOperationWithMessage(`FastQC failed`);
                        return;
                    }
                }
                if (!self.fastQCFlags.success) {
                    self.spawnUpdate = params;
                    self.update();
                }
                else if (self.fastQCFlags.success) {
                    setTimeout(function () {
                        try {
                            fse.copySync(`${self.srcDir}/fastqc_report.html`, `${self.destDir}/fastqc_report.html`);
                            fse.copySync(`${self.srcDir}/summary.txt`, `${self.destDir}/summary.txt`);
                            fse.copySync(`${self.srcDir}/fastqc_data.txt`, `${self.destDir}/fastqc_data.txt`);
                        }
                        catch (err) {
                            self.abortOperationWithMessage(err);
                            return;
                        }
                        self.fastq.QCData.QCReport = self.destDir;
                        try {
                            self.fastq.QCData.summary = QCReportSummary_1.getQCReportSummaries(`${self.fastq.QCData.QCReport}/fastqc_data.txt`);
                        }
                        catch (err) {
                            self.abortOperationWithMessage(`Failed to get summaries for ${self.fastq.QCData.QCReport}/fastqc_data.txt
									${err}`);
                            return;
                        }
                        self.setSuccess(self.flags);
                        self.update();
                    }, 1000);
                }
            }
        };
        this.fastQCJob = new Job_1.Job(this.fastQCPath, args, "", true, fastQCCallBack, {});
        try {
            this.fastQCJob.Run();
        }
        catch (err) {
            self.abortOperationWithMessage(`${err}`);
            return;
        }
    }
}
exports.GenerateQCReport = GenerateQCReport;
