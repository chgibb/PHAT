import * as electron from "electron";
const screen = electron.screen;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import { AtomicOperation } from "../operations/atomicOperations";

let electronTabs : any = undefined;
let tabGroup : any = undefined;
let dragula : any = undefined;
let drake : any = undefined;

/**
 * Initialize tab container and needed third party libraries
 * 
 * @returns {void} 
 */
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
            drake = dragula([tabGroup.tabContainer],{
                direction : "horizontal"
            });
            drake.on("dragend",function(el : any,container : any,source : any){
                let clientBounds = electron.remote.getCurrentWindow().getBounds();
                let cursorPos = screen.getCursorScreenPoint();

                //if a tab is dragged outside of the bounds of the window, undock it
                if(cursorPos.x < clientBounds.x)
                    unDockActiveTab();
                else if(cursorPos.y < clientBounds.y)
                    unDockActiveTab();
                else if(cursorPos.x > clientBounds.x + clientBounds.width)
                    unDockActiveTab();
                else if(cursorPos.y > clientBounds.y + clientBounds.height)
                    unDockActiveTab();
            });
        }
    });
    
    //make tabs hoverable
    tabGroup.on("tab-added",function(tab : any,tabGroup : any){
        let tabs = document.getElementsByClassName("etabs-tab");
        for(let i = 0; i != tabs.length; ++i)
        {
            if(!tabs[i].classList.contains("activeHover"))
                tabs[i].classList.add("activeHover");
        }
    });

    //map window reference names to config objects for constructing tabs
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
/**
 * Config object to construct a tab
 * 
 * @export
 * @interface Tab
 */
export interface Tab
{
    filePath : string;
    title : string;
    visible : boolean;
    active : boolean;
}

let refNameToTab : {[key : string] : Tab;} = {};

/**
 * Map from a tab title to its window reference name
 * 
 * @param {string} title 
 * @returns {(string | undefined)} 
 */
function getRefNameFromTitle(title : string) : string | undefined
{
    for(let i in refNameToTab)
    {
        if(refNameToTab[i].title == title)
        {
            return i;
        }
    }
    return undefined;
}

/**
 * Allow docking of windows into this window
 * 
 * @export
 */
export function initializeWindowDock() : void
{
    ipc.on("dockWindow",function(event : Electron.IpcMessageEvent,arg : DockIpc){
        //lazy load the tab container and associated libraries
        ensureTabGroupInit();
        //get config object for tab being added
        let tab = refNameToTab[arg.refName];
        //add tab to tab group
        let newTab = tabGroup.addTab({
            title : tab.title,
            src : `file://${getReadable(tab.filePath)}`,
            visible : tab.visible,
            active : tab.active,
            webviewAttributes : {nodeintegration : true}
        });
        //forward console messages from tab into the window's console
        newTab.webview.addEventListener("console-message",function(e : any){
            console.log(`${tab.title}: ${e.message}`);
        });
    });
}

let refNameToDock = "";
export function makeWindowDockable(refName : string) : void
{
    refNameToDock = refName;
}

export function dockThisWindow(target = "toolBar") : void
{
    if(!refNameToDock)
        return;
    dockWindow(refNameToDock,target);
}

/**
 * Dock a new window given by refName into the window given by target
 * 
 * @export
 * @param {string} refName 
 * @param {string} target 
 */
export function dockWindow(refName : string,target : string) : void
{
    ipc.send(
        "runOperation",
        <AtomicOperationIPC>{
            opName : "dockWindow",
            toDock : refName,
            dockTarget : target
        }
    );
}

/**
 * Move the active tab into its own window
 * 
 * @export
 */
export function unDockActiveTab() : void
{
    //mutate a property onto the active tab object to indicate it is being moved into a new window
    tabGroup.getActiveTab().unDocked = true;
    ipc.send(
        "runOperation",
        <AtomicOperationIPC>{
            opName : "unDockWindow",
            refName : getRefNameFromTitle(tabGroup.getActiveTab().title),
            guestinstance : tabGroup.getActiveTab().webview.guestinstance
        }
    );
}

/**
 * Clean up tabs whos guestinstances have been moved
 * 
 * @export
 */
export function removeZombieTabs() : void
{
    //The "destroy" event on <webview>s is broken https://github.com/electron/electron/issues/9675
    //We have to manually remove tabs that have been moved into new windows
    //let the event loop spin before we try to remove
    setTimeout(function(){
        setImmediate(function(){
            setImmediate(function(){
                tabGroup.eachTab(function(currentTab : any,index : number,tabs : Array<any>){
                    if(currentTab.unDocked){
                        console.log(`removed ${currentTab.title}`);
                        currentTab.close();
                    }
                });
            });
        });
    },10);
}