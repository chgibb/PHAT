/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

import * as viewMgr from "./../viewMgr";

export class HelpView extends viewMgr.View
{
    public constructor(div : string)
    {
        super("helpView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new HelpView(div));
}