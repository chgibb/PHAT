import * as fs from "fs";
import * as readline from "readline";
import * as atomic from "./atomicOperations";

import alignData from "./../alignData"
import * as cf from "./../renderer/circularFigure";
export class RenderCoverageTracksForContig extends atomic.AtomicOperation
{
    public alignData : alignData;
    public contiguuid : string;
    public circularFigure : cf.CircularFigure;
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
        try
        {
            cf.cacheCoverageTracks(
                this.circularFigure,
                this.contiguuid,
                this.alignData,
                function(status,coverageTracks){
                    if(status == true)
                    {
                        self.setSuccess(self.flags);
                        self.update();
                    }
                }
            );
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
            return;
        }
    }
}