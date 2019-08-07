import { PHATObject, DepRoot, TaskArtifact } from './phatObject';
import { UniquelyAddressable } from './uniquelyAddressable';

export interface FastqTreeData extends UniquelyAddressable, DepRoot
{
   
}

export class FastqTree extends PHATObject<FastqTreeData>
{
    public data : FastqTreeData;

    public constructor(data : FastqTreeData)
    {
        super();
        this.data = data;
    }
}