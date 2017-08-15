import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {SaveKeyEvent} from "./../../ipcEvents";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {getReadable} from "./../../getAppPath";

import * as viewMgr from "./../viewMgr";
import * as fastqView from "./FastqView";
import * as fastaView from "./FastaView";
import {inputBrowseDialog} from "./inputBrowseDialog";
import Fastq from "./../../fastq";
import {Fasta} from "./../../fasta";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender : boolean;
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;
    public currentView : "fastqView" | "fastaView";
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.firstRender = true;
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array<Fasta>();
        this.currentView = "fastqView";
    }
    public onMount() : void
    {
        fastqView.addView(this.views,"tableView");
        fastaView.addView(this.views,"tableView");
        for(let i = 0 ; i != this.views.length; ++i)
        {
            this.views[i].mount();
        }
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.firstRender = false;
            return `
                <img class="activeHover" id="fastqViewButton" src="${this.currentView == "fastqView" ? getReadable("img/fastqButtonActive.png") : getReadable("img/fastqButton.png")}">
                <img class="activeHover" id="refSeqViewButton" src="${this.currentView == "fastaView" ? getReadable("img/refSeqButtonActive.png") : getReadable("img/refSeqButton.png")}">
                <div id="tableView" style=""width:100%;">
                </div>
            `;
        }
        else
        {
            let idx = viewMgr.getIndexOfViewByName(this.currentView,this.views);
            this.views[idx].render();
            return undefined;
        }
    }
    public postRender() : void
    {

    }
    public divClickEvents(event : JQueryEventObject) : void
    {
        let shouldUpdate = false;
        if(event.target.id == "browseInputFiles")
        {
            inputBrowseDialog();
            return;
        }
        if(event.target.id == "refSeqViewButton")
        {
            this.currentView = "fastaView";
            this.firstRender = true;
            viewMgr.render();
            viewMgr.render();
            return;
        }
        if(event.target.id == "fastqViewButton")
        {
            this.currentView = "fastqView";
            this.firstRender = true;
            viewMgr.render();
            viewMgr.render();
            return;
        }
        if(event.target.id == "importSelected")
        {
            for(let i = 0; i != this.fastqInputs.length; ++i)
            {
                if(this.fastqInputs[i].checked)
                {
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "importFileIntoProject",
                            uuid : this.fastqInputs[i].uuid
                        }
                    );
                }
            }
            for(let i = 0; i != this.fastaInputs.length; ++i)
            {
                if(this.fastaInputs[i].checked)
                {
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "importFileIntoProject",
                            uuid : this.fastaInputs[i].uuid
                        }
                    );
                }
            }
        }
        
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            let classList = event.target.classList;
            if(event.target.classList.contains(`${this.fastqInputs[i].uuid}Class`))
            {
                let row = document.getElementById(`${this.fastqInputs[i].uuid}Row`);
                if(row.classList.contains("selected"))
                {
                    row.classList.remove("selected");
                    this.fastqInputs[i].checked = false;
                    shouldUpdate = true;
                    break;
                }
                else
                {
                    row.classList.add("selected");
                    this.fastqInputs[i].checked = true;
                    shouldUpdate = true;
                    break;
                }
            }
        }
        
        if(!shouldUpdate)
        {
            for(let i = 0; i != this.fastaInputs.length; ++i)
            {
                if(event.target.id == `${this.fastaInputs[i].uuid}Index`)
                {
                     ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "indexFasta",
                            channel : "input",
                            key : "fastaInputs",
                            uuid : this.fastaInputs[i].uuid
                        }
                    );
                    break;
                }
                let classList = event.target.classList;
                if(event.target.classList.contains(`${this.fastaInputs[i].uuid}Class`))
                {
                    let row = document.getElementById(`${this.fastaInputs[i].uuid}Row`);
                    if(row.classList.contains("selected"))
                    {
                        row.classList.remove("selected");
                        this.fastaInputs[i].checked = false;
                        shouldUpdate = true;
                        break;
                    }
                    else
                    {
                        row.classList.add("selected");
                        this.fastaInputs[i].checked = true;
                        shouldUpdate = true;
                        break;
                    }
                }
            }
        }

        if(shouldUpdate)
        {
            ipc.send(
                "saveKey",
                <SaveKeyEvent>{
                    action : "saveKey",
                    channel : "input",
                    key : "fastqInputs",
                    val : this.fastqInputs
                }
            );
            ipc.send(
                "saveKey",
                <SaveKeyEvent>{
                    action : "saveKey",
                    channel : "input",
                    key : "fastaInputs",
                    val : this.fastaInputs
                }
            );
        }
    }
    public dataChanged() : void
    {
        let fastqView = <fastqView.View>viewMgr.getViewByName("fastqView",this.views);
        fastqView.fastqInputs = this.fastqInputs;

        let fastaView = <fastaView.View>viewMgr.getViewByName("fastaView",this.views);
        fastaView.fastaInputs = this.fastaInputs;

    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
