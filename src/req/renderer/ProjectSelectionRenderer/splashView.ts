/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

import * as viewMgr from "./../viewMgr";

export class SplashView extends viewMgr.View
{
    public constructor(div : string)
    {
        super("splashView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <h1>Pathogen Host Analysis Tool</h1>
        `;
    }
    public postRender() : void
    {}
    public dataChanged() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {

    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new SplashView(div));
}