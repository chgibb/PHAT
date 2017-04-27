import * as fs from "fs";
import * as readline from "readline";
import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";

import alignData from "./../alignData"
import * as cf from "./../renderer/circularFigure";
export class RenderCoverageTrackForContig extends atomic.AtomicOperation
{
    public alignData : alignData;
    public contiguuid : string;
    public circularFigure : cf.CircularFigure;

    public renderCoverageTrackProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : {
        circularFigure : cf.CircularFigure,
        contiguuid : string,
        alignData : alignData
    }) : void
    {
        this.circularFigure = data.circularFigure;
        this.contiguuid = data.contiguuid;
        this.alignData = data.alignData;
    }
    public run() : void
    {
        let self = this;
        this.renderCoverageTrackProcess = cp.fork("resources/app/RenderCoverageTracks.js");
        self.renderCoverageTrackProcess.on(
            "message",function(ev : AtomicOperationForkEvent)
            {
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
                    self.update();
                }
            }
        );
        setTimeout(
            function(){
                self.renderCoverageTrackProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : {
                            alignData : self.alignData,
                            contiguuid : self.contiguuid,
                            circularFigure : self.circularFigure
                        }
                    }
                );
            },500
        );
    }
}