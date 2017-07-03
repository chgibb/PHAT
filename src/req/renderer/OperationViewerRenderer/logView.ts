import * as viewMgr from "./../viewMgr";

import {LogRecord} from "./../../operations/atomicOperations"

export class View extends viewMgr.View
{
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
                    <th>Description</th>
                    <th>Status</th>
                    <th>Runtime</th>
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