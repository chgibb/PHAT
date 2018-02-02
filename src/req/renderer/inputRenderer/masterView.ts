import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {SaveKeyEvent} from "./../../ipcEvents";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {getReadable} from "./../../getAppPath";

import * as viewMgr from "./../viewMgr";
import * as fastqView from "./FastqView";
import * as fastaView from "./FastaView";
import * as alignView from "./AlignView";
import * as linkRefView from "./LinkRefView";
import {inputFastqDialog} from "./inputFastqDialog";
import {inputFastaDialog} from "./inputFastaDialog";
import {inputAlignDialog} from "./inputAlignDialog";

import {Fastq} from "./../../fastq";
import {Fasta} from "./../../fasta";
import {AlignData} from "./../../alignData";
import {getLinkableRefSeqs,LinkableRefSeq} from "./../../getLinkableRefSeqs";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender : boolean;
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;
    public aligns : Array<AlignData>;
    public currentView : "fastqView" | "fastaView" | "alignView" | "linkRefView";
    public progressMessage : string;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.firstRender = true;
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array<Fasta>();
        this.aligns = new Array<AlignData>();
        this.currentView = "fastqView";
        this.progressMessage = "";
    }
    public onMount() : void
    {
        fastqView.addView(this.views,"tableView");
        fastaView.addView(this.views,"tableView");
        alignView.addView(this.views,"tableView");
        linkRefView.addView(this.views,"tableView");
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.firstRender = false;
            return `
                <img class="activeHover activeHoverButton" id="fastqViewButton" src="${this.currentView == "fastqView" ? getReadable("img/fastqButtonActive.png") : getReadable("img/fastqButton.png")}">
                <img class="activeHover activeHoverButton" id="refSeqViewButton" src="${this.currentView == "fastaView" ? getReadable("img/refSeqButtonActive.png") : getReadable("img/refSeqButton.png")}">
                <img class="activeHover activeHoverButton" id="alignViewButton" src="${this.currentView == "alignView" ? getReadable("img/alignButtonActive.png") : getReadable("img/alignButton.png")}">
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
        if(event.target.id == "browseFastqFiles")
        {
            inputFastqDialog();
            return;
        }
        if(event.target.id == "browseFastaFiles")
        {
            inputFastaDialog();
            return;
        }
        if(event.target.id == "browseAlignFiles")
        {
            inputAlignDialog();
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
        if(event.target.id == "alignViewButton" || event.target.id == "linkRefViewGoBackAlignView")
        {
            this.currentView = "alignView";
            this.firstRender = true;
            viewMgr.render();
            viewMgr.render();
            return;
        }
        if(event.target.id == "importSelectedFastqs")
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
        }
        if(event.target.id == "importSelectedFastas")
        {
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
                            opName : "indexFastaForAlignment",
                            channel : "input",
                            key : "fastaInputs",
                            uuid : this.fastaInputs[i].uuid
                        }
                    );
                    break;
                }
                if(event.target.id == `${this.fastaInputs[i].uuid}IndexForVisualization`)
                {
                     ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "indexFastaForVisualization",
                            channel : "input",
                            key : "fastaInputs",
                            uuid : this.fastaInputs[i].uuid
                        }
                    );
                    break;
                }
                if(event.target.id == `${this.fastaInputs[i].uuid}LongReason`)
                {
                    let linkRefView = <linkRefView.View>viewMgr.getViewByName("linkRefView",this.views);
                    for(let k = 0; k != linkRefView.linkableRefSeqs.length; ++k)
                    {
                        if(this.fastaInputs[i].uuid == linkRefView.linkableRefSeqs[k].uuid)
                        {
                            alert(`${linkRefView.linkableRefSeqs[k].longReason}`);
                            break;
                        }
                    }
                }
                if(event.target.id == `${this.fastaInputs[i].uuid}Link`)
                {
                    let linkRefView = <linkRefView.View>viewMgr.getViewByName("linkRefView",this.views);
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "linkRefSeqToAlignment",
                            fasta : this.fastaInputs[i],
                            align : linkRefView.inspectingAlign
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
            for(let i = 0; i != this.aligns.length; ++i)
            {
                if(event.target.id == `${this.aligns[i].uuid}LinkRef`)
                {
                    let linkRefView = <linkRefView.View>viewMgr.getViewByName("linkRefView",this.views);
                    linkRefView.inspectingAlign = this.aligns[i];
                    linkRefView.onMount();
                    this.currentView = "linkRefView";
                    this.firstRender = true;
                    viewMgr.render();
                    viewMgr.render();
                    return;
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
        fastqView.progressMessage = this.progressMessage;

        let fastaView = <fastaView.View>viewMgr.getViewByName("fastaView",this.views);
        fastaView.fastaInputs = this.fastaInputs;
        fastaView.progressMessage = this.progressMessage;

        let alignView = <alignView.View>viewMgr.getViewByName("alignView",this.views);
        alignView.aligns = this.aligns;
        alignView.progressMessage = this.progressMessage;

        let linkRefView = <linkRefView.View>viewMgr.getViewByName("linkRefView",this.views);
        linkRefView.fastaInputs = this.fastaInputs;
        linkRefView.progressMessage = this.progressMessage;
        if(linkRefView.inspectingAlign && this.currentView == "linkRefView")
        {
            for(let i = 0; i != this.aligns.length; ++i)
            {
                if(this.aligns[i].uuid == linkRefView.inspectingAlign.uuid)
                {
                    if(this.aligns[i].fasta !== undefined)
                    {
                        this.currentView = "alignView";
                        viewMgr.render();
                        break;
                    }
                }
            }
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
