import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "../atomicOperationsIPC";

export class BLASTSegment extends atomic.AtomicOperation
{
    public blastSegment : cp.ChildProcess;

    public constructor()
    {
        super();
    }

    public setData(data : any) : void
    {

    }

    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        
        let self = this;
        this.blastSegment = atomic.makeFork("BLASTSegment.js",<AtomicOperationForkEvent>{
            setData : true,
            data : <AtomicOperationIPC>{},
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