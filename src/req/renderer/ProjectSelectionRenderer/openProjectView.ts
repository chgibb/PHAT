/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

const jsonFile = require("jsonfile");

import {ProjectManifest,getProjectManifests} from "./../../projectManifest";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as viewMgr from "./../viewMgr";

export class OpenProjectView extends viewMgr.View
{
    public projects : Array<ProjectManifest>;
    public constructor(div : string)
    {
        super("openProjectView",div);
    }
    public onMount() : void
    {
        let projects : Array<ProjectManifest>;
        try
        {
            projects = jsonFile.readFileSync(getProjectManifests());
        }
        catch(err)
        {
            projects = new Array<ProjectManifest>();
        }
        this.projects = projects;
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        return `

            ${(()=>{
                let res = `<button id="goBack">Go Back</button><br /><br />`;
                if(this.projects)
                {
                    for(let i = 0; i != this.projects.length; ++i)
                    {
                        res += `
                            <div class="projectCell">
                                <h4 class="activeHover" style="display:flex;margin-right:50px;" id="${this.projects[i].uuid}">${this.projects[i].alias}</h4>
                                <button class="activeHover" style="display:inline-block;">Export</button>
                            </div>
                            <br />
                            <br />
                            <br />
                        `;
                    }
                }
                if(!this.projects || this.projects.length == 0)
                {
                    res += `
                        <div class="innerCenteredDiv">
                            <h3>You have no projects</h3>
                        </div>
                    `;
                }

                return res;
            })()}

        `;
    }
    public postRender() : void
    {}
    public dataChanged() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.id == "goBack")
        {
            viewMgr.changeView("splashView");
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new OpenProjectView(div));
}