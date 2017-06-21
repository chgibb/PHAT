/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

const jsonFile = require("jsonfile");
const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {ProjectManifest,getProjectManifests} from "./../../projectManifest";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {View} from "./../viewMgr";
export class ProjectsView extends View
{
    public projects : Array<ProjectManifest>;
    public constructor(div : string)
    {
        super("projectsView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <button id="createNewProject">Create New Project</button>
            ${(()=>{
                let res = "";
                if(!this.projects)
                    return "<h2>You have no projects</h2>";
                if(this.projects)
                {
                    if(this.projects.length == 0)
                        return res;
                    for(let i = 0; i != this.projects.length; ++i)
                    {
                        let lastOpened = new Date(this.projects[i].lastOpened);
                        let created = new Date(this.projects[i].created);

                        res += `
                            <h4 class="activeHover" id="${this.projects[i].uuid}open">${this.projects[i].alias}</h4>
                            <h6 class="activeHover" id="${this.projects[i].uuid}export">Export</h6>
                            <h6>Last Opened: ${lastOpened}</h6>
                            <h6>Created: ${created}</h6>
                        `;
                    }
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
        if(event.target.id == "createNewProject")
        {
            dialogs.prompt("Project Name","New Project",function(text : string){

                if(text)
                {
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "newProject",
                            name : text
                        }
                    );
                }

            });
        }
        if(this.projects)
        {
            for(let i = 0; i != this.projects.length; ++i)
            {
                if(event.target.id == `${this.projects[i].uuid}open`)
                {
                    this.projects[i].lastOpened = Date.now();
                    jsonFile.writeFileSync(getProjectManifests(),this.projects);
                    document.getElementById(this.div).innerHTML = "Preparing";
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "openProject",
                            proj : this.projects[i]
                        }
                    );
                }
                if(event.target.id == `${this.projects[i].uuid}export`)
                {
                    
                }
            }
        }
    }
}
export function addView(arr : Array<View>,div : string) : void
{
    arr.push(new ProjectsView(div));
}