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
                let res = `<button id="goBack">Go Back</button>`;
                if(this.projects)
                {

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