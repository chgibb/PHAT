import * as viewMgr from "./../viewMgr";

import {AtomicOperation} from "./../../operations/atomicOperations"

export class View extends viewMgr.View
{
    public ops : Array<AtomicOperation>;
    public constructor(div : string)
    {
        super("runningView",div);

    }
    public onMount() : void{}
    public onUnMount() : void{}
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
    public renderView() : string
    {
        return `
            <table style="width:100%">
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>Started</th>
                </tr>

            </table>
        `;
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}