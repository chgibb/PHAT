/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
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
            <div class="innerCenteredDiv">
                <h2><b>Pathogen Host Analysis Tool</b></h2>
                <div class="innerCenteredDiv">
                    <br />
                    <br />
                    <button class="activeHover" id="openProject">Open Project</button>
                    <br />
                    <br />
                    <button class="activeHover" id="createNewProject">Create New Project</button>
                    <br />
                    <br />
                    <button class="activeHover" id="help">Help</button>
                </div>
            </div>
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
        if(event.target.id == "openProject")
        {
            viewMgr.changeView("openProjectView");
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new SplashView(div));
}