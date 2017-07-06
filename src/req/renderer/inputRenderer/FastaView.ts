import * as viewMgr from "./../viewMgr";

export class View extends viewMgr.View
{
    public searchFilter : RegExp;
    public filterString : string;
    public constructor(div : string)
    {
        super("fastaView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <div class="outerCenteredDiv">
                <div class="innerCenteredDiv">
                    <h2>Reference Sequence Files</h2>
                </div>
            </div>
            <table style="width:100%">
                <tr>
                    <th>Sample</th>
                </tr>
            </table>
        `;
    }
    public postRender() : void
    {

    }
    public divClickEvents(event : JQueryEventObject) : void
    {

    }
    public dataChanged() : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
