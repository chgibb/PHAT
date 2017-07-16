/// <reference types="jquery" />
import * as electron from "electron";
const remote = electron.remote;

import * as viewMgr from "./../viewMgr";
import {getAppSettings,writeAppSettings} from "./../../appSettings";

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
                <br />
                <br />
                <br />
                <h5>PHAT will check for an update everytime it restarts from the following channel</h5>
                <input type="radio" id="stableChannel" name="updateChannel" style="display:inline-block;" /><h5 style="display:inline-block;">Stable</h5>
                <br />
                <input type="radio" id="betaChannel" name="updateChannel" style="display:inline-block;" /><h5 style="display:inline-block;">Beta</h5><h5>Note: Beta may potentially include unstable and or breaking changes. Used to test new functionality and features before releasing to stable</h5>
                
            </div>
        `;
    }
    public postRender() : void
    {
        if(getAppSettings().updateChannel == "stable")
            (<HTMLInputElement>document.getElementById("stableChannel")).checked = true;
        else if(getAppSettings().updateChannel == "beta")
            (<HTMLInputElement>document.getElementById("betaChannel")).checked = true;
    }
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
        if(event.target.id == "stableChannel")
        {
            let appSettings = getAppSettings();
            appSettings.updateChannel = "stable";
            writeAppSettings(appSettings);
            viewMgr.render();
            return;
        }
        if(event.target.id == "betaChannel")
        {
            let appSettings = getAppSettings();
            appSettings.updateChannel = "beta";
            writeAppSettings(appSettings);
            viewMgr.render();
            return;
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new HelpView(div));
}