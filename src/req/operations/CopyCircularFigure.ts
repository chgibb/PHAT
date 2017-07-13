import * as fse from "fs-extra";
const uuidv4 : () => string = require("uuid/v4");

import * as atomic from "./atomicOperations";
import * as cf from "./../renderer/circularFigure";
import {getReadableAndWritable} from "./../getAppPath";
export class CopyCircularFigure extends atomic.AtomicOperation
{
    public origFigure : cf.CircularFigure;
    public newFigure : cf.CircularFigure;
    public constructor()
    {
        super();
        this.newFigure = <any>{};
    }
    public setData(data : cf.CircularFigure) : void
    {
        this.origFigure = data;
    }
    public run() : void
    {
        this.logKey = atomic.openLog(this.name,"Copy Circular Figure");
        try
        {
            Object.assign(this.newFigure,this.origFigure);
            this.newFigure.uuid = uuidv4();
            let self = this;
            fse.copy(
                getReadableAndWritable(`rt/circularFigures/${this.origFigure.uuid}`),
                getReadableAndWritable(`rt/circularFigures/${this.newFigure.uuid}`),
                function(err : Error){
                    if(err)
                        self.abortOperationWithMessage(err.message);
                    self.setSuccess(self.flags);
                }
            );
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
        }
    }
}