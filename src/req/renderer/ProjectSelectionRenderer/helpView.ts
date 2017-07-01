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
            <button class="activeHover" id="goBack">Go Back</button>
            <div class="innerCenteredDiv">
                <br />
                <br />
                <button class="activeHover" id="helpAndTutorials">Help and Tutorials</button>
                <br />
                <br />
                <button class="activeHover" id="howToUse">How To Use PHAT</button>
                <br />
                <br />
                <button class="activeHover" id="sendUsFeedBack">Send Us Feedback</button>
                <br />
                <br />
                <button class="activeHover" id="makeBetter">Help Us Make PHAT Better For Everyone</button>
                
            </div>
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.id == "goBack")
        {
            viewMgr.changeView("splashView");
            return;
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new HelpView(div));
}