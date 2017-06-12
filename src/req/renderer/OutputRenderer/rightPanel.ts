import * as viewMgr from "./../viewMgr";

export class RightPanel extends viewMgr.View
{
    public constructor(name : string,div : string)
    {
        super(name,div);
    }

    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        console.log("rendered panel");
        return `
            <input type="radio" /><p>FastQ QC Info</p>
        `;
    }

    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new RightPanel("rightPanel",div));
}