/// <reference types="jquery" />

import * as electron from "electron";
const ipc = electron.ipcRenderer;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import {SaveKeyEvent} from "./../../ipcEvents";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as viewMgr from "./../viewMgr";
import {CircularFigure} from "./../circularFigure";
import {reCacheBaseFigure} from "./reCacheBaseFigure";
import {Fasta} from "./../../fasta";
import {AlignData} from "./../../alignData";

import * as GenomeView from "./genomeView";
import * as tc from "./templateCache";

import {writeAlignsModal} from "./writeAlignsModal";
import {writeAvailableTracksModal} from "./writeAvailableTracksModal";
import {writeContigEditorModal} from "./writeContigEditorModal";
import {writeContigCreatorModal} from "./writeContigCreatorModal";
import {writeEditContigsModal} from "./writeEditContigsModal";
import {showGenericLoadingSpinnerInNavBar} from "./loadingSpinner";


const $ = require("jquery");
(<any>window).$ = $;
(<any>window).jQuery = $;
(<any>window).Tether = require("tether");
require("bootstrap");
require("rangeslider.js");

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
/**
 * Manages the display and the behaviour of the figure editor
 * 
 * @export
 * @class View
 * @extends {viewMgr.View}
 */
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public circularFigures : Array<CircularFigure>;
    public alignData : Array<AlignData>;
    public fastaInputs : Array<Fasta>;
    public alignsModalOpen : boolean;
    public availableTracksModalOpen : boolean;
    public contigEditorModalOpen : boolean;
    public contigCreatorModalOpen : boolean;
    public editContigsModalOpen : boolean;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.circularFigures = new Array<CircularFigure>();
        this.fastaInputs = new Array<Fasta>();
        this.alignsModalOpen = false;
        this.availableTracksModalOpen = false;
        this.contigEditorModalOpen = false;
        this.contigCreatorModalOpen = false;
        this.editContigsModalOpen = false;
    }
    /**
     * Retrieve all the alignments run for the currently open figure
     * 
     * @returns {(Array<AlignData> | undefined)} 
     * @memberof View
     */
    public getAlignsForOpenGenome() : Array<AlignData> | undefined
    {
        let res : Array<AlignData> = new Array<AlignData>();
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!this.alignData || !genomeView.genome)
            return undefined;
        for(let i = 0; i != this.alignData.length; ++i)
        {
            if(this.alignData[i].fasta && this.alignData[i].fasta.uuid == genomeView.genome.uuidFasta)
            {
                res.push(this.alignData[i]);
            }
        }
        if(res.length == 0)
            return undefined;
        return res;
    }
    /**
     * Show the modal, with whatever happens to be on it. Bootstrap only allows a single modal
     * 
     * @memberof View
     */
    public showModal() : void
    {
        try
        {
            (<any>$(".modal")).modal("show");
            document.getElementsByClassName("modal-backdrop")[0].classList.remove("modal-backdrop");
        }
        catch(err){}
    }
    /**
     * Dismiss the modal
     * 
     * @memberof View
     */
    public dismissModal() : void
    {
        (<any>$(".modal")).modal("hide");
    }
    public resetModalStates() : void
    {
        this.alignsModalOpen = false;
        this.availableTracksModalOpen = false;
        this.contigCreatorModalOpen = false;
        this.contigEditorModalOpen = false;
        this.editContigsModalOpen = false;
    }
    /**
     * Highlight the currently open figure in the "Figures" dropdown
     * 
     * @returns {void} 
     * @memberof View
     */
    public setSelectedFigureInDropDown() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!genomeView.genome)
            return;
        for(let i = 0; i != this.circularFigures.length; ++i)
        {
            if(genomeView.genome.uuid == this.circularFigures[i].uuid)
            {
                try
                {
                    document.getElementById(`${this.circularFigures[i].uuid}Open`).classList.add("selectedFigureInDropDown");
                }
                catch(err){}
            }
        }
    }
    /**
     * Update the textbox in the navbar with the radius of the open figure
     * 
     * @memberof View
     */
    public setFigureRadiusInInput() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        let el = (<HTMLInputElement>document.getElementById("figureRadiusInput"));
        if(!genomeView.genome)
            el.value = "";
        else
            el.value = genomeView.genome.radius.toString();
    }
    /**
     * Update the textbox in the navbar with the track interval of the open figure
     * 
     * @memberof View
     */
    public setFigureBPIntervalInput() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        let el = (<HTMLInputElement>document.getElementById("figureBPIntervalInput"));
        if(!genomeView.genome)
            el.value = "";
        else
            el.value = genomeView.genome.circularFigureBPTrackOptions.interval.toString();
    }
    /**
     * Update the checkbox in the navbar with the interval status of the open figure
     * 
     * @returns {void} 
     * @memberof View
     */
    public setShowBPIntervalCheckBox() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!genomeView.genome)
            return;
        let checkbox = (<HTMLInputElement>document.getElementById("showBPIntervalCheckBox"));
        if(genomeView.genome.circularFigureBPTrackOptions.showLabels == 0)
            checkbox.checked = false;
        else if(genomeView.genome.circularFigureBPTrackOptions.showLabels == 1)
            checkbox.checked = true;
    }
    /**
     * On startup. Apply behaviour to static dropdowns and controls
     * 
     * @memberof View
     */
    public onMount() : void
    {
        GenomeView.addView(this.views,"genomeView");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onMount();
        }
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        let self = this;
        window.onbeforeunload = function(e){
            self.saveFigureChanges();
        }
        document.getElementById("figures").onclick = function(this : HTMLElement,ev : MouseEvent){
            for(let i = 0; i != self.fastaInputs.length; ++i)
            {
                if((<any>ev.target).id == `${self.fastaInputs[i].uuid}NewFigure`)
                {
                    self.circularFigures.push(new CircularFigure(
                        "New Figure",
                        self.fastaInputs[i].uuid,
                        self.fastaInputs[i].contigs
                    ));
                    self.saveFigureChanges();
                    genomeView.genome = self.circularFigures[self.circularFigures.length - 1];
                    genomeView.firstRender = true;
                    viewMgr.render();
                    self.setSelectedFigureInDropDown();
                    return;
                }
            }
            for(let i = 0; i != self.circularFigures.length; ++i)
            {
                if((<any>ev.target).id == `${self.circularFigures[i].uuid}Open`)
                {
                    genomeView.genome = self.circularFigures[i];
                    genomeView.firstRender = true;
                    viewMgr.render();
                    self.setSelectedFigureInDropDown();
                    return;
                }
            }
        }
        document.getElementById("figureOptions").onclick = function(this : HTMLElement,ev : MouseEvent){
            if((<any>event.target).id == `${genomeView.genome.uuid}ToggleInteractivity`)
            {
                genomeView.genome.isInteractive = !genomeView.genome.isInteractive;
                self.saveFigureChanges();
                genomeView.firstRender = true;
                viewMgr.render();
            }
            if((<any>event.target).id == `${genomeView.genome.uuid}ToggleContigNames`)
            {
                genomeView.genome.showContigNames = !genomeView.genome.showContigNames;
                self.saveFigureChanges();
                genomeView.firstRender = true;
                viewMgr.render();
            }
            if((<any>event.target).id == `EditFigureName`)
            {
                genomeView.figureNameOnClick();
            }
            if((<any>event.target).id ==`EditContigs`)
            {
                self.editContigsModalOpen = true;
                writeEditContigsModal();
                self.showModal();

            }
        }

        document.getElementById("showBPIntervalCheckBox").onclick = function(this : HTMLElement,ev : MouseEvent){
            document.getElementById("updateNavBarButton").click();
        }

        document.getElementById("openModalAligns").onclick = function(this : HTMLElement,ev : MouseEvent){
            self.alignsModalOpen = true;
            writeAlignsModal();
            self.showModal();
        }

        document.getElementById("openContigCreator").onclick = function(this : HTMLElement,ev : MouseEvent){
            self.contigCreatorModalOpen = true;
            writeContigCreatorModal();
            self.showModal();
        }

        document.getElementById("exportToSVG").onclick = function(this : HTMLElement,ev : MouseEvent){
            if(!genomeView.genome)
            {
                dialogs.alert("You must open a figure before you can export it");
                return;
            }
            genomeView.exportSVG();
        }

        document.getElementById("copyFigure").onclick = function(this : HTMLElement,ev : MouseEvent){
            if(!genomeView.genome)
            {
                dialogs.alert("You must open a figure before you can copy it");
                return;
            }
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "copyCircularFigure",
                    figureuuid : genomeView.genome.uuid
                }
            );
        }

        document.getElementById("deleteFigure").onclick = function(this : HTMLElement,ev : MouseEvent){
            if(!genomeView.genome)
            {
                dialogs.alert("You must open a figure before you can delete it");
                return;
            }
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "deleteCircularFigure",
                    figureuuid : genomeView.genome.uuid
                }
            );
        }

        document.getElementById("updateNavBarButton").onclick = function(this : HTMLElement,ev : MouseEvent){
            let radiusHasChanged = false;
            let trackIntervalChanged = false;
            let showIntervalChanged = false;
            if(!genomeView.genome)
                    return;
            let radius = parseInt((<HTMLInputElement>document.getElementById("figureRadiusInput")).value);
            if(radius)
            {
                if(radius != genomeView.genome.radius)
                    radiusHasChanged = true;
                genomeView.genome.radius = radius;
            }

            let trackInterval = parseInt((<HTMLInputElement>document.getElementById("figureBPIntervalInput")).value);
            if(trackInterval)
            {
                if(trackInterval != genomeView.genome.circularFigureBPTrackOptions.interval)
                    trackIntervalChanged = true;
                genomeView.genome.circularFigureBPTrackOptions.interval = trackInterval;
            }

            let showInterval = ((<HTMLInputElement>document.getElementById("showBPIntervalCheckBox")).checked);
            if(showInterval !== undefined)
            {
                if((showInterval === true && genomeView.genome.circularFigureBPTrackOptions.showLabels == 0) || (showInterval === false && genomeView.genome.circularFigureBPTrackOptions.showLabels == 1))
                    showIntervalChanged = true;
                if(showInterval === true)
                    genomeView.genome.circularFigureBPTrackOptions.showLabels = 1;
                else
                    genomeView.genome.circularFigureBPTrackOptions.showLabels = 0;
            }
            if(radiusHasChanged || trackIntervalChanged || showIntervalChanged)
            {
                genomeView.firstRender = true;
                tc.triggerReCompileForWholeFigure(genomeView.genome);
                self.saveFigureChanges();
            }
            genomeView.updateScope();
            viewMgr.render();
        }
        
        $('input[type="range"]').rangeslider({
            polyfill : false,
            onInit : function() {
                // DEBUG
                this.output = $( '<div class="range-output" />' ).insertAfter( this.$range ).html( this.$element.val() );
            },
            onSlide : function( position: any,value: any ) {
                // DEBUG
                this.output.html( value );
                let svgs = (<any>document.getElementsByTagName("svg"));                
                
                for(var i = 0; i < svgs.length; i++){
                    let bbox=svgs[i].getBBox();
                
                    let cx=bbox.x+(bbox.width/2),
                        cy=bbox.y+(bbox.height/2);  
                    let scalex=value, scaley=value;    
                    let saclestr=scalex+','+scaley;
                
                    let tx=-cx*(scalex-1);
                    let ty=-cy*(scaley-1);                        
                    let translatestr=tx+','+ty;
                    
                    svgs[i].style.webkitTransform = "scale("+saclestr+")";
                }
                
            }
        });
        

        //on modal dismissal
        $("#modal").on('hidden.bs.modal',function(){
            self.resetModalStates();
        });
    }
    public onUnMount() : void
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onUnMount();
        }
    }
    /**
     * Update dynamic dropdowns and controls. Call render on GenomeView
     * 
     * @returns {string} 
     * @memberof View
     */
    public renderView() : string
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        let res = "";
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].checked && this.fastaInputs[i].indexedForVisualization)
            {
                res += `
                    <li><b>${this.fastaInputs[i].alias}</b></li>
                    <li role="separator" class="divider"></li>
                    <li><i><a id="${this.fastaInputs[i].uuid}NewFigure" href="#">New Figure</a></i></li>
                    <li role="separator" class="divider"></li>
                `;
                for(let j = 0; j != this.circularFigures.length; ++j)
                {
                    if(this.fastaInputs[i].checked && this.circularFigures[j].uuidFasta == this.fastaInputs[i].uuid)
                    {
                        res += `
                            <li><a id="${this.circularFigures[j].uuid}Open"href="#">${this.circularFigures[j].name}</a></li>
                        `;
                    }
                }
                res += `<li role="separator" class="divider"></li>`;
            }
        }
        document.getElementById("figures").innerHTML = res;

        res = ""
        if(genomeView.genome)
        {
            res += `<li><a href="#" id="${genomeView.genome.uuid}ToggleInteractivity">${genomeView.genome.isInteractive ? "Disable Interactivity" : "Enable Interactivity"}</a></li>`;
            res += `<li><a href="#" id="${genomeView.genome.uuid}ToggleContigNames">${genomeView.genome.showContigNames ? "Don't Show Contig Names" : "Show Contig Names"}</a></li>`;
            res += `<li><a href="#" id="EditFigureName">Edit Figure Name</a></li>`;
            res += `<li><a href="#" id="EditContigs">Edit Contigs</a></li>`;
        }
        document.getElementById("figureOptions").innerHTML = res;

        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].render();
        }
        if(this.alignsModalOpen)
            writeAlignsModal();
        if(this.availableTracksModalOpen)
            writeAvailableTracksModal();
        if(this.contigEditorModalOpen)
            writeContigEditorModal();
        if(this.contigCreatorModalOpen)
            writeContigCreatorModal();

        //viewMgr will not call postRender for a view that does no rendering so we'll do it explicitly
        this.postRender();
        return undefined;
    }
    public postRender() : void
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].postRender();
        }
        this.setSelectedFigureInDropDown();
        this.setFigureRadiusInInput();
        this.setFigureBPIntervalInput();
        this.setShowBPIntervalCheckBox();
    }
    /**
     * Save circular figures for the open project
     * 
     * @memberof View
     */
    public dataChanged() : void
    {
        ipc.send(
            "saveKey",
            <SaveKeyEvent>{
                action : "saveKey",
                channel : "circularGenomeBuilder",
                key : "circularFigures",
                val : this.circularFigures
            }
        );
    }
    /**
     * Save changes to the open figure. Resets SVG caches to force figure updating
     * 
     * @memberof View
     */
    public saveFigureChanges() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);       
        this.dataChanged();
        if(genomeView.genome)
        {
            tc.resetBaseFigureCache();
            reCacheBaseFigure(genomeView.genome);
        }
    }
    public divClickEvents(event : JQueryEventObject) : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);        
    }
}