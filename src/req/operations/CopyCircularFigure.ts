
import * as cf from "../renderer/circularFigure/circularFigure";

import * as atomic from "./atomicOperations";
import {getReadableAndWritable} from "./../getAppPath";

const uuidv4: () => string = require("uuid/v4");
const fse = require("fs-extra");

export interface CopyCircularFigureData {
    opName: "copyCircularFigure";
    data: cf.CircularFigure;
}

export class CopyCircularFigure extends atomic.AtomicOperation<CopyCircularFigureData>
{
    public origFigure: cf.CircularFigure | undefined;
    public newFigure: cf.CircularFigure;
    public constructor(data: CopyCircularFigureData) 
    {
        super(data);
        this.newFigure = <any>{};

        this.origFigure = data.data;
    }

    public run(): void 
    {
        this.logRecord = atomic.openLog(this.opName, "Copy Circular Figure");
        try 
        {
            Object.assign(this.newFigure, this.origFigure);
            this.newFigure.uuid = uuidv4();

            if(this.origFigure)
            {
                for(let i = 0; i != this.origFigure.visibleLayers.length; ++i)
                {
                    if(this.origFigure.visibleLayers[i] == this.origFigure.uuid)
                    {
                        this.origFigure.visibleLayers[i] = this.newFigure.uuid;
                    }
                }
            }

            let self = this;
            fse.copy(
                getReadableAndWritable(`rt/circularFigures/${this.origFigure!.uuid}`),
                getReadableAndWritable(`rt/circularFigures/${this.newFigure.uuid}`),
                function (err: Error) 
                {
                    if (err)
                        self.abortOperationWithMessage(err.message);
                    self.setSuccess(self.flags);
                    self.update!();
                }
            );
        }
        catch (err) 
        {
            this.abortOperationWithMessage(err);
        }
    }
}