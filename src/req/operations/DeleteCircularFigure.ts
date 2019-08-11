
import * as atomic from "./atomicOperations";
import * as cf from "./../renderer/circularFigure";
import { getReadableAndWritable } from "./../getAppPath";

const fse = require("fs-extra");

export interface DeleteCircularFigureData {
    opName: "deleteCircularFigure";
    data: cf.CircularFigure;
}

export class DeleteCircularFigure extends atomic.AtomicOperation<DeleteCircularFigureData>
{
    public figure: cf.CircularFigure;
    public constructor(data: DeleteCircularFigureData) {
        super(data);

        this.figure = data.data;
    }

    public run(): void {
        this.logRecord = atomic.openLog(this.opName, "Delete Circular Figure");
        try {
            let self = this;
            fse.remove(
                getReadableAndWritable(`rt/circularFigures/${this.figure.uuid}`),
                function (err: Error) {
                    if (err)
                        self.abortOperationWithMessage(err.message);
                    self.setSuccess(self.flags);
                    self.update!();
                }
            );
        }
        catch (err) {
            this.abortOperationWithMessage(err);
        }
    }
}