const Dialogs = require("dialogs");
const dialogs = Dialogs();

import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import * as cf from "./../circularFigure";
import {reCacheBaseFigure} from "./reCacheBaseFigure";
import {writeLoadingModal} from "./writeLoadingModal";
let contig : cf.Contig;
let editedAlias = "";
export function setSelectedContigByUUID(uuid : string) : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    for(let i = 0; i != genomeView.genome.contigs.length; ++i)
    {
        if(genomeView.genome.contigs[i].uuid == uuid)
        {
            contig = genomeView.genome.contigs[i];
            editedAlias = contig.alias;
            return;
        }
    }

    for(let i = 0; i != genomeView.genome.customContigs.length; ++i)
    {
        if(genomeView.genome.customContigs[i].uuid == uuid)
        {
            contig = genomeView.genome.customContigs[i];
            editedAlias = contig.alias;
            return;
        }
    }
}

export function writeContigEditorModal() : void
{
    if(!contig)
        throw new Error("Tried to edit contig which does not exist");
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Edit Contig ${contig.name}`;
    let body = ``;
    body += `
        <h5>Name in Reference:</h4>
        <h4>${contig.name}</h4>
        <h5>Display Name:</h5>
        <h4 id="contigAlias" class="activeHover">${editedAlias}</h4>
        <br />
        <h5>Text Colour</h5>
        <input type="text" id="fontColourPicker" data-format="rgb" style="display:inline-block;" value="${contig.fontFill}">
        <br />
        <h5>Contig Fill Colour</h5>
        <input type="text" id="fillColourPicker" data-format="rgb" value="${contig.color}">
    `; 
    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
        <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
    `;

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;

    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.contigEditorModalOpen = false;
    }

    document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
        contig.alias = editedAlias;
        let colour : string = (<string>(<any>$(document.getElementById("fillColourPicker"))).minicolors("rgbString"));
        let fontColour : string = (<string>(<any>$(document.getElementById("fontColourPicker"))).minicolors("rgbString"));
        contig.color = colour;
        contig.fontFill = fontColour;
        masterView.contigEditorModalOpen = false;
        masterView.dismissModal();

        masterView.dataChanged();

        masterView.loadingModal = true;
        writeLoadingModal();

        setTimeout(function(){
            reCacheBaseFigure(genomeView.genome).then(() => {
                masterView.loadingModal = false;
                masterView.dismissModal();
                genomeView.firstRender = true;
                viewMgr.render();
            });
        },10);

        viewMgr.render();
    
    }

    document.getElementById("contigAlias").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.dismissModal();
        dialogs.prompt("Contig Name",editedAlias,function(text : string){
            if(text)
                editedAlias = text;
            masterView.showModal();
            viewMgr.render();
        });
    }
    let colourPicker = document.getElementById("fillColourPicker");
    (<any>$(colourPicker)).minicolors({
        control : "hue",
        defaultValue : "",
        format : "rgb",
        keywords : "",
        inline : false,
        swatches : [],
        theme : "default",
        change : function(hex : string,opacity : string){}
    });
    let fontColourPicker = document.getElementById("fontColourPicker");
    (<any>$(fontColourPicker)).minicolors({
        control : "hue",
        defaultValue : "",
        format : "rgb",
        keywords : "",
        inline : false,
        swatches : [],
        theme : "default",
        change : function(hex : string,opacity : string){}
    });
}