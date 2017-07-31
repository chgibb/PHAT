/// <reference types="jquery" />
import {ipcRenderer} from "electron";
let ipc = ipcRenderer;

const Dialogs = require("dialogs");
const dialogs = Dialogs();
const jsonFile = require("jsonfile");

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {AtomicOperation} from "./../../operations/atomicOperations";
import {getReadable} from "./../../getAppPath";
import {ProjectManifest,getProjectManifests} from "./../../projectManifest";
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
                <h2 style="margin-bottom:0px;margin-top:0px;"><b>Pathogen</b></h2>
                <h2 style="margin-bottom:0px;margin-top:0px;"><b>Host</b></h2>
                <h2 style="margin-bottom:0px;margin-top:0px;"><b>Analysis</b></h2>
                <h2 style="margin-bottom:0px;margin-top:0px;"><b>Tool</b></h2>
                <br />
                <br />
                <img src="${getReadable("img/openProject.png")}" class="activeHover" id="openProject" />
                <br />
                <br />
                <img src="${getReadable("img/newProject.png")}" class="activeHover" id="createNewProject" />
                <br />
                <br />
                <img src="${getReadable("img/help.png")}" class="activeHover" id="help" />
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
                    //wait for the response from newProject and then open the newly created project from the manifest
                    new Promise<void>((resolve,reject) => {
                        function doneOperation(event : any,arg : any){
                            if(arg.action == "getKey" || arg.action == "keyChange")
                            {
                                if(arg.key == "operations" && arg.val !== undefined)
                                {
                                    let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                                    for(let i = 0 ; i != ops.length; ++i)
                                    {
                                        if(ops[i].name == "newProject")
                                        {
                                            if(ops[i].flags.done)
                                            {
                                                ipc.removeListener("projectSelection",doneOperation);
                                                if(ops[i].flags.success)
                                                    resolve();
                                                else if(ops[i].flags.failure)
                                                    reject();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        ipc.on("projectSelection",doneOperation);
                    }).then(() =>{
                        let projects : Array<ProjectManifest> = (<Array<ProjectManifest>>jsonFile.readFileSync(getProjectManifests()));
                        ipc.send(
                            "runOperation",
                            <AtomicOperationIPC>{
                                opName : "openProject",
                                proj : projects[projects.length - 1]
                            }
                        )
                    }).catch(() => {
                        alert("There was an error creating your project");
                    });
                }
            });
            return;
        }
        if(event.target.id == "openProject")
        {
            viewMgr.changeView("openProjectView");
            return;
        }
        if(event.target.id == "help")
        {
            viewMgr.changeView("helpView");
            return;
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new SplashView(div));
}