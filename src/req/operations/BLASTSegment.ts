import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "../atomicOperationsIPC";
import {BLASTSegmentResult,getArtifactDir} from "./../BLASTSegmentResult";
import { AlignData } from "../alignData";

export class BLASTSegment extends atomic.AtomicOperation
{
    public blastSegmentResult : BLASTSegmentResult;
    public alignData : AlignData;

    public blastSegment : cp.ChildProcess;

    public constructor()
    {
        super();
    }

    public setData(data : {
        align : AlignData,
        contigUUID : string,
        start : number,
        stop : number
    }) : void {
        this.blastSegmentResult = new BLASTSegmentResult();
        this.blastSegmentResult.start = data.start;
        this.blastSegmentResult.stop = data.stop;
        this.blastSegmentResult.alignUUID = data.align.uuid;
        this.blastSegmentResult.contigUUID = data.contigUUID;
        this.destinationArtifactsDirectories.push(getArtifactDir(this.blastSegmentResult));
    }

    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        
        let self = this;
        this.blastSegment = atomic.makeFork("BLASTSegment.js",<AtomicOperationForkEvent>{
            setData : true,
            data : <AtomicOperationIPC>{
                align : self.alignData,
                blastSegmentResult : self.blastSegmentResult
            },
            name : self.name,
            description : "BLAST Segment"
        },function(ev : AtomicOperationForkEvent){

            if(ev.finishedSettingData == true)
            {
                self.blastSegment.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }

            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags;
                if(ev.flags.done)
                {
                    self.logRecord = ev.logRecord;
                    atomic.recordLogRecord(ev.logRecord);
                }
                self.update();
            }
        });

        this.addPID(this.blastSegment.pid);                                                
    }
}