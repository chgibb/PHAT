import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {getReadable} from "./../getAppPath";

let electronTabs : any = undefined;
let tabGroup : any = undefined;

function ensureTabGroupInit() : void
{
    if(tabGroup)
        return;

    document.body.innerHTML += `
    <div class="etabs-tabgroup">
        <div class="etabs-tabs"></div>
        <div class="etabs-buttons"></div>
    </div>
    <div class="etabs-views"></div>
    `;

    electronTabs = require("electron-tabs");

    tabGroup = new electronTabs();
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

refNameToTab["circularGenomeBuilder"] = <Tab>{
    filePath : "circularGenomeBuilder.html",
    title : "Genome Builder",
    visible : true,
    active : true
};

export function initializeWindowDock() : void
{
    ipc.on("dockWindow",function(event : Electron.IpcMessageEvent,arg : DockIpc){
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