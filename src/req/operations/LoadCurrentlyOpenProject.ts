import * as atomic from "./atomicOperations";
import { finishLoadingProject } from "./../main/finishLoadingProject";
import { getCurrentlyOpenProject } from "./../getCurrentlyOpenProject";

export interface LoadCurrentlyOpenProjectData {
    operationName: "loadCurrentlyOpenProject";
}

export class LoadCurrentlyOpenProject extends atomic.AtomicOperation<LoadCurrentlyOpenProjectData>
{
    public constructor(data: LoadCurrentlyOpenProjectData) {
        super(data);
    }

    public run(): void {
        this.logRecord = atomic.openLog(this.operationName, "Load Currently Open Project");
        try {
            finishLoadingProject(getCurrentlyOpenProject()!);
            this.setSuccess(this.flags);
        }
        catch (err) {
            this.abortOperationWithMessage(err);
        }
        this.update!();
    }
}