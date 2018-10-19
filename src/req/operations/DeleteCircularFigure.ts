const fse = require("fs-extra");

import * as atomic from "./atomicOperations";
import * as cf from "./../renderer/circularFigure";
import {getReadableAndWritable} from "./../getAppPath";
import { Mangle } from '../mangle';
export class DeleteCircularFigure extends atomic.AtomicOperation
{
    @Mangle public  figure : cf.CircularFigure;
    public  constructor()
    {
        super();
    }
    @Mangle public  setData(data : cf.CircularFigure) : void
    {
        this.figure = data;
    }
    @Mangle public  run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Delete Circular Figure");
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