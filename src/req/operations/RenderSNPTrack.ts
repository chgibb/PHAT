import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import {AlignData} from "./../alignData";
import * as cf from "./../renderer/circularFigure";

export interface RenderSNPTrackForContigData
{
    opName : "renderSNPTrackForContig";
    circularFigure : cf.CircularFigure;
    contiguuid : string;
    alignData : AlignData;
    colour? : string;
}
export class RenderSNPTrackForContig extends atomic.AtomicOperation<RenderSNPTrackForContigData>
{
    public alignData : AlignData ;
    public contiguuid : string;
    public circularFigure : cf.CircularFigure;
    public colour : string | undefined;

    public renderSNPTrackProcess : cp.ChildProcess | undefined;
    constructor(data : RenderSNPTrackForContigData)
    {
        super(data);

        this.circularFigure = data.circularFigure;
        this.contiguuid = data.contiguuid;
        this.alignData = data.alignData;
        this.colour = data.colour;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog(this.opName,"Render SNP Track");
        let self = this;
        this.renderSNPTrackProcess = atomic.makeFork("RenderSNPTrack.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                alignData : self.alignData,
                contiguuid : self.contiguuid,
                circularFigure : self.circularFigure,
                colour : self.colour
            }
        },function(ev : AtomicOperationForkEvent)
        {
            if(ev.finishedSettingData == true)
            {
                self.renderSNPTrackProcess!.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags!;
                if(ev.flags!.success == true)
                {
                    self.circularFigure = ev.data.circularFigure;
                    self.contiguuid = ev.data.contiguuid;
                    self.alignData = ev.data.alignData;
                    self.colour = ev.data.colour;
                }
                self.update!();
            }
        });
        this.addPID(this.renderSNPTrackProcess.pid);
    }
}