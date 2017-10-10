import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";

import {AlignData} from "./../alignData"
import * as cf from "./../renderer/circularFigure";
export class RenderCoverageTrackForContig extends atomic.AtomicOperation
{
    public alignData : AlignData;
    public contiguuid : string;
    public circularFigure : cf.CircularFigure;
    public colour : string;
    public scaleFactor : number;
    public renderCoverageTrackProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : {
        circularFigure : cf.CircularFigure,
        contiguuid : string,
        alignData : AlignData,
        colour : string,
        scaleFactor : number
    }) : void
    {
        this.circularFigure = data.circularFigure;
        this.contiguuid = data.contiguuid;
        this.alignData = data.alignData;
        this.colour = data.colour;
        this.scaleFactor = data.scaleFactor;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Render Coverage Track");
        let self = this;
        this.renderCoverageTrackProcess = atomic.makeFork("RenderCoverageTrack.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                alignData : self.alignData,
                contiguuid : self.contiguuid,
                circularFigure : self.circularFigure,
                colour : self.colour,
                scaleFactor : self.scaleFactor
            }
        },function(ev : AtomicOperationForkEvent){
            if(ev.finishedSettingData == true)
            {
                self.renderCoverageTrackProcess.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }

            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags;
                if(ev.flags.success == true)
                {
                    self.circularFigure = ev.data.circularFigure;
                    self.contiguuid = ev.data.contiguuid;
                    self.alignData = ev.data.alignData;
                    self.colour = ev.data.colour;
                }
                self.update();
            }
        });
        this.addPID(this.renderCoverageTrackProcess.pid);
    }
}