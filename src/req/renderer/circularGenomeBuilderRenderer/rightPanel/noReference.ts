import * as viewMgr from "./../../viewMgr";

export class NoReference extends viewMgr.View
{
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <h3>Select a reference from the left to view coverage visualization options</h3>
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new NoReference("noReference",div));
}