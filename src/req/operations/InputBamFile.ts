import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import { AtomicOperationForkEvent } from "./../atomicOperationsIPC";
import { getReadable } from "./../getAppPath";
import { AlignData, getArtifactDir } from "./../alignData";
import { Fasta, getFaiPath } from "./../fasta";
import { getPath } from "./../file";

export interface InputBamFileData {
    operationName: "inputBamFile";
    bamPath: string;
    fasta?: Fasta;
}

export class InputBamFile extends atomic.AtomicOperation<InputBamFileData>
{
    public bamPath: string;
    public fasta: Fasta | undefined;
    public alignData: AlignData;
    public inputBamFileProcess: cp.ChildProcess | undefined;
    constructor(data: InputBamFileData) {
        super(data);

        this.bamPath = data.bamPath;
        this.fasta = data.fasta;
        if (this.fasta)
            this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);
        this.alignData = new AlignData();
        this.alignData.isExternalAlignment = true;
        this.destinationArtifactsDirectories.push(getArtifactDir(this.alignData));
    }

    public run(): void {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.inputBamFileProcess = atomic.makeFork("InputBamFile.js", <AtomicOperationForkEvent>{
            setData: true,
            data: {
                bamPath: self.bamPath,
                fastaPath: self.fasta ? getPath(self.fasta) : "",
                align: self.alignData
            },
            name: self.operationName,
            description: "Input Bam File"
        }, function (ev: AtomicOperationForkEvent) {
                if (ev.finishedSettingData == true) {
                    self.inputBamFileProcess!.send(
                        <AtomicOperationForkEvent>{
                            run: true
                        }
                    );
                }
                if (ev.update == true) {
                    self.flags = ev.flags!;
                    if (ev.flags!.done) {
                        if (ev.data.alignData)
                            self.alignData = ev.data.alignData;
                        self.logRecord = ev.logRecord;
                        atomic.recordLogRecord(ev.logRecord!);
                    }
                    self.progressMessage = ev.progressMessage;
                    self.update!();
                }
            });
        this.addPID(this.inputBamFileProcess.pid);
    }
}