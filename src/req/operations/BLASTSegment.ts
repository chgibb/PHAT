import * as cp from "child_process";

import {AtomicOperationForkEvent, AtomicOperationIPC} from "../atomicOperationsIPC";
import {AlignData} from "../alignData";

import * as atomic from "./atomicOperations";
import {BLASTSegmentResult, getArtifactDir} from "./../BLASTSegmentResult";
import * as dFormat from "./../dateFormat";

export interface BLASTSegmentData {
    opName: "BLASTSegment";
    align: AlignData,
    start: number,
    stop: number
}

export class BLASTSegment extends atomic.AtomicOperation<BLASTSegmentData>
{
    public blastSegmentResult: BLASTSegmentResult | undefined;
    public alignData: AlignData | undefined;

    public blastSegment: cp.ChildProcess | undefined;

    public constructor(data: BLASTSegmentData) 
    {
        super(data);
        this.blastSegmentResult = new BLASTSegmentResult();
        this.blastSegmentResult!.start = data.start;
        this.blastSegmentResult!.stop = data.stop;
        this.alignData = data.align;
        this.destinationArtifactsDirectories.push(getArtifactDir(this.blastSegmentResult));
    }

    public run(): void 
    {
        this.blastSegmentResult!.dateStamp = dFormat.generateFixedSizeDateStamp();
        this.blastSegmentResult!.dateStampString = dFormat.formatDateStamp(this.blastSegmentResult!.dateStamp);

        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;

        let self = this;
        this.blastSegment = atomic.makeFork("BLASTSegment.js", <AtomicOperationForkEvent>{
            setData: true,
            data: <AtomicOperationIPC>{
                align: self.alignData,
                blastSegmentResult: self.blastSegmentResult
            },
            name: self.opName,
            description: "BLAST Segment"
        }, function (ev: AtomicOperationForkEvent) 
        {

            if (ev.finishedSettingData == true) 
            {
                    self.blastSegment!.send(
                        <AtomicOperationForkEvent>{
                            run: true
                        }
                    );
            }

            if (ev.update == true) 
            {
                self.progressMessage = ev.progressMessage;
                self.extraData = ev.data;
                self.flags = ev.flags!;
                if (ev.flags!.done) 
                {
                    self.logRecord = ev.logRecord;
                    atomic.recordLogRecord(ev.logRecord!);
                    if (ev.flags!.success === true) 
                    {
                        self.blastSegmentResult = ev.data.blastSegmentResult;
                    }
                }
            }
                self.update!();
        });

        this.addPID(this.blastSegment.pid);
    }
}