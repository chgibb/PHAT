import * as atomic from "./atomicOperations";
import {File,importIntoProject} from "./../file";
import {getReadableAndWritable} from "./../getAppPath";
export class ImportFileIntoProject extends atomic.AtomicOperation
{
    public file : File;
    constructor()
    {
        super();
    }
    public setData(data : File) : void
    {
        this.file = data;
        this.destinationArtifactsDirectories.push(
            getReadableAndWritable(`rt/imported/${this.file.uuid}`)
        );
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Import File Into Project");
        let self = this;
        importIntoProject(this.file).then(() => {
            self.setSuccess(self.flags);
            self.update();
        }).catch((err : Error) => {
            self.abortOperationWithMessage(err.message);
        });
        this.update();
    }
}