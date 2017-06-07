/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;
const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {ProjectManifest} from "./../../projectManifest";
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
    }
}
export function addView(arr : Array<View>,div : string) : void
{
    arr.push(new ProjectsView(div));
}