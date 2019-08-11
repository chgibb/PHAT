import * as atomic from "./atomicOperations";
import {File,importIntoProject} from "./../file";
import {getReadableAndWritable} from "./../getAppPath";

export interface ImportFileIntoProjectData
{
    opName : "importFileIntoProject";
    data : File;
}

export class ImportFileIntoProject extends atomic.AtomicOperation<ImportFileIntoProjectData>
{
    public file : File;
    constructor(data : ImportFileIntoProjectData)
    {
        super(data);

        this.file = data.data;
        this.destinationArtifactsDirectories.push(
            getReadableAndWritable(`rt/imported/${this.file.uuid}`)
        );
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.opName,"Import File Into Project");
        let self = this;
        importIntoProject(this.file!)!.then(() => 
        {
            self.setSuccess(self.flags);
            self.update!();
        }).catch((err : Error) => 
        {
            self.abortOperationWithMessage(err.message);
        });
        this.update!();
    }
}