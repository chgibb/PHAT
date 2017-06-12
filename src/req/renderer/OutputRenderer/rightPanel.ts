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
        return `
            <div>
                <input style="display:inline-block;" id="QCRadio" type="radio" name="selectedInfo" />
                    <p style="display:inline-block;">FastQ QC Info</p>
            </div>
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