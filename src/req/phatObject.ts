import { UniquelyAddressable } from './uniquelyAddressable';

export interface TaskArtifact
{
    basePath : string;
    signature : string;
    mTime : string;
}

export interface DepRoot
{
    artifacts : Array<TaskArtifact>;
}

export abstract class PHATObject<T extends UniquelyAddressable & DepRoot> implements UniquelyAddressable {
    public abstract data: T;

    public get uuid() {
        return this.data.uuid;
    }
}
