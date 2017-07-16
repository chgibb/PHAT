import * as fse from "fs-extra";

import * as atomic from "./atomicOperations";
import * as cf from "./../renderer/circularFigure";
import {getReadableAndWritable} from "./../getAppPath";
export class DeleteCircularFigure extends atomic.AtomicOperation
{
    public figure : cf.CircularFigure;
    public constructor()
    {
        super();
    }
    public setData(data : cf.CircularFigure) : void
    {
        this.figure = data;
    }
    public run() : void
    {
        this.logKey = atomic.openLog(this.name,"Delete Circular Figure");
        try
        {
            let self = this;
            fse.remove(
                getReadableAndWritable(`rt/circularFigures/${this.figure.uuid}`),
                function(err : Error){
                    if(err)
                        self.abortOperationWithMessage(err.message);
                    self.setSuccess(self.flags);
                    self.update();
                }
            );
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
        }
    }
}