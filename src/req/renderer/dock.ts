import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";

let electronTabs : any = undefined;
let tabGroup : any = undefined;
let dragula : any = undefined;
function ensureTabGroupInit() : void
{
    if(tabGroup)
        return;

    document.body.insertAdjacentHTML("beforeend",`
    <div id="dock"
        <div class="etabs-tabgroup">
            <div class="etabs-tabs"></div>
            <div class="etabs-buttons"></div>
        </div>
        <div class="etabs-views"></div>
    </div>
    `);

    electronTabs = require("@chgibb/electron-tabs");
    dragula = require("dragula");

    tabGroup = new electronTabs({
        ready : function(tabGroup : any){
            dragula([tabGroup.tabContainer],{
                direction : "horizontal"
            });
        }
    });
    
    tabGroup.on("tab-added",function(tab : any,tabGroup : any){
        let tabs = document.getElementsByClassName("etabs-tab");
        for(let i = 0; i != tabs.length; ++i)
        {
            if(!tabs[i].classList.contains("activeHover"))
                tabs[i].classList.add("activeHover");
        }
    });

    refNameToTab["input"] = <Tab>{
        filePath : "Input.html",
        title : "Input",
        visible : true,
        active : true
    };
    
    refNameToTab["QC"] = <Tab>{
        filePath : "QC.html",
        title : "QC",
        visible : true,
        active : true
    };

    refNameToTab["align"] = <Tab>{
        filePath : "Align.html",
        title : "Align",
        visible : true,
        active : true
    };

    refNameToTab["output"] = <Tab>{
        filePath : "Output.html",
        title : "Output",
        visible : true,
        active : true
    };
    
    refNameToTab["circularGenomeBuilder"] = <Tab>{
        filePath : "circularGenomeBuilder.html",
        title : "Genome Builder",
        visible : true,
        active : true
    };
}

export interface DockIpc
{
    refName : "circularGenomeBuilder";
}

export interface Tab
{
    filePath : string;
    title : string;
    visible : boolean;
    active : boolean;
}

let refNameToTab : {[key : string] : Tab;} = {};

export function initializeWindowDock() : void
{
    ipc.on("dockWindow",function(event : Electron.IpcMessageEvent,arg : DockIpc){
        console.log(arg);
        ensureTabGroupInit();
        let tab = refNameToTab[arg.refName];
        tabGroup.addTab({
            title : tab.title,
            src : `file://${getReadable(tab.filePath)}`,
            visible : tab.visible,
            active : tab.active,
            webviewAttributes : {nodeintegration : true}
        });
    });
}

let refNameToDock = "";
export function makeWindowDockable(refName : string) : void
{
    refNameToDock = refName;
}

export function dockWindow(target = "toolBar") : void
{
    if(!refNameToDock)
        return;
    ipc.send(
        "runOperation",
        <AtomicOperationIPC>{
            opName : "dockWindow",
            toDock : refNameToDock,
            dockTarget : target
        }
    );
    electron.remote.getCurrentWindow().close();
}