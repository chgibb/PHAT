/// <reference types="jquery" />
import * as electron from "electron";
const ipc = electron.ipcRenderer;
const remote = electron.remote;

import * as viewMgr from "./../viewMgr";

const pjson = require("./package.json");

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
        if(event.target.id == "helpAndTutorials")
        {
            remote.shell.openExternal(`${pjson.repository.url}/wiki`);
            return;
        }
        if(event.target.id == "howToUse")
        {
            remote.shell.openExternal(`${pjson.repository.url}/wiki/How-to-use-P.H.A.T`);
            return;
        }
        if(event.target.id == "sendUsFeedBack")
        {
            remote.shell.openExternal(`${pjson.repository.url}/issues`);
            return;
        }
        if(event.target.id == "makeBetter")
        {
            remote.shell.openExternal(`${pjson.repository.url}/pulls`);
            return;
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new HelpView(div));
}