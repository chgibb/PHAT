import * as viewMgr from "./../../viewMgr";

export class NoCoverage extends viewMgr.View
{
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `<h3>Run alignments with this reference to generate coverage data to visualize</h3>`;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new NoCoverage("noCoverage",div));
}