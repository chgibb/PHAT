const fse = require("fs-extra");
const uuidv4 : () => string = require("uuid/v4");

import * as atomic from "./atomicOperations";
import * as cf from "./../renderer/circularFigure";
import {getReadableAndWritable} from "./../getAppPath";
import { Mangle } from '../mangle';
export class CopyCircularFigure extends atomic.AtomicOperation
{
    @Mangle public  origFigure : cf.CircularFigure;
    @Mangle public  newFigure : cf.CircularFigure;
    public  constructor()
    {
        super();
        this.newFigure = <any>{};
    }
    @Mangle public  setData(data : cf.CircularFigure) : void
    {
        this.origFigure = data;
    }
    @Mangle public  run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Copy Circular Figure");
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