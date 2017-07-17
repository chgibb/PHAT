/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

const jsonFile = require("jsonfile");

import {ProjectManifest,getProjectManifests} from "./../../projectManifest";
import {getCurrentlyOpenProject} from "./getCurrentlyOpenProject";
import {exportProjectBrowseDialog} from "./exportProjectBrowseDialog";
import {importProjectBrowseDialog} from "./importProjectBrowseDialog";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";

import * as viewMgr from "./../viewMgr";

export class OpenProjectView extends viewMgr.View
{
    public projects : Array<ProjectManifest>;
    public currentlyOpenProject : ProjectManifest;
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
        this.currentlyOpenProject = getCurrentlyOpenProject();
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        return `

            ${(()=>{
                let res = `
                    <button class="activeHover" id="goBack">Go Back</button>
                    <button class="activeHover" id="openFromFile">Open From File</button>
                    <br />
                    <br />
                `;
                if(this.currentlyOpenProject)
                {
                    res += `
                    <h3>Currently Open Project</h3>
                    <h4 class="activeHover" style="display:flex;margin-right:50px;" id="currentlyOpen">${this.currentlyOpenProject.alias}</h4>
                    <br />
                    `;
                }
                if(this.projects)
                {
                    for(let i = 0; i != this.projects.length; ++i)
                    {
                        res += `
                            <div class="projectCell">
                                <h4 class="activeHover" style="display:flex;margin-right:50px;" id="${this.projects[i].uuid}Open">${this.projects[i].alias}</h4>
                                <button class="activeHover" style="display:inline-block;" id="${this.projects[i].uuid}Export">Export</button>
                            </div>
                            <br />
                        `;
                    }
                }
                if((!this.projects || this.projects.length == 0) && !this.currentlyOpenProject)
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
            return;
        }
        if(event.target.id == "openFromFile")
        {
            importProjectBrowseDialog().then((path) => {
                if(!path)
                    return;
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "openProject",
                        externalProjectPath : path
                    }
                );
            }).catch((err) => {
                throw err
            });
        }
        if(this.projects)
        {
            for(let i = 0; i != this.projects.length; ++i)
            {
                if(event.target.id == `${this.projects[i].uuid}Open`)
                {
                    this.projects[i].lastOpened = Date.now();
                    document.getElementById(this.div).innerHTML = "Preparing";
                    jsonFile.writeFileSync(getProjectManifests(),this.projects);
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "openProject",
                            proj : this.projects[i]
                        }
                    );
                    return;
                }
                if(event.target.id == `${this.projects[i].uuid}Export`)
                {
                    document.getElementById(this.div).innerHTML = `<h3>Exporting ${this.projects[i].alias}</h3>`;
                    exportProjectBrowseDialog(this.projects[i]).then(() => {
                        viewMgr.render();
                    }).catch((err) => {
                        throw err;
                    });
                }
            }
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new OpenProjectView(div));
}