import * as electron from "electron";
const ipc = electron.ipcRenderer;



const jsonFile = require("jsonfile");
const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {AtomicOperation} from "./req/operations/atomicOperations"
import {AtomicOperationIPC} from "./req/atomicOperationsIPC";
import {GetKeyEvent,KeySubEvent,SaveKeyEvent} from "./req/ipcEvents";

import {ProjectManifest,manifestsPath} from "./req/projectManifest";

import {checkServerPermission} from "./req/checkServerPermission";
import formatByteString from "./req/renderer/formatByteString";

import * as viewMgr from "./req/renderer/viewMgr";

import * as projectsView from "./req/renderer/ProjectSelectionRenderer/projectsView";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

function refreshProjects() : void
{
    jsonFile.readFile(manifestsPath,function(err : string,obj : Array<ProjectManifest>){
        let projectsView = <projectsView.ProjectsView>viewMgr.getViewByName("projectsView");
        projectsView.projects = obj;
        viewMgr.render();
    });
}

$
(
    function()
    {
        refreshProjects();
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "projectSelection"
            }
        );
        projectsView.addView(viewMgr.views,"projects");
        viewMgr.changeView("projectsView");
        ipc.on
        (
            "projectSelection",function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "operations" && arg.val !== undefined)
                    {
                        let ops : Array<AtomicOperation> = <Array<AtomicOperation>>arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].name == "openProject")
                            {
                                document.body.innerHTML = `
                                    <h1>Unpacked ${ops[i].extraData.unPacked} of ${ops[i].extraData.toUnpack}</h1>
                                `;
                                return;
                            }
                        }
                        refreshProjects();
                    }
                }
            }
        )
    }
);