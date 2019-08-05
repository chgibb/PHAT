import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import * as cf from "./../circularFigure";
import {reCacheBaseFigure} from "./reCacheBaseFigure";
import {showGenericLoadingSpinnerInNavBar,hideSpinnerInNavBar} from "./loadingSpinner";

const Dialogs = require("dialogs");
const dialogs = Dialogs();
let contig : cf.Contig;
let editedAlias = "";

/**
 * Set the contig to edit by uuid
 * 
 * @export
 * @param {string} uuid 
 * @returns {void} 
 */
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

/**
 * Writes the contig editor menu into the modal
 * 
 * @export
 */
export function writeContigEditorModal() : void
{
    if(!contig)
        throw new Error("Tried to edit contig which does not exist");
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Edit Contig ${contig.name}`;
    let body = "";
    body += `
        <h5>Name in Reference</h4>
        <h4>${contig.name}</h4>
        <h5>Display Name</h5>
        <h4 id="contigAlias" class="activeHover">${editedAlias}</h4>
        <br />
        <h5>Text Colour</h5>
        <input type="text" id="fontColourPicker" data-format="rgb" style="display:inline-block;" value="${contig.fontFill}">
        <br />
        <h5>Contig Fill Colour</h5>
        <input type="text" id="fillColourPicker" data-format="rgb" value="${contig.color}">
    `;
    //for custom contigs only
    if(contig.allowPositionChange)
    {
        body += `
            <h5>Vertical Adjustment</h5>
            <input type="number" id="vAdjust" value="${contig.vAdjust}" />
            <br />
            <h5>Start</h5>
            <input type="number" id="start" value="${contig.start}" />
            <br />
            <h5>End</h5>
            <input type="number" id="end" value="${contig.end}" />
            <br />
            <br />
            <h5 style="color:red;" class="activeHover" id="deleteContig">Delete Contig</h5>

        `;
    } 
    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
        <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
    `;

    document.getElementById("modalTitle")!.innerHTML = title;
    document.getElementById("modalBody")!.innerHTML = body;
    document.getElementById("modalFooter")!.innerHTML = footer;

    document.getElementById("footerClose")!.onclick = function(this : GlobalEventHandlers,ev : MouseEvent)
    {
        masterView.contigEditorModalOpen = false;
    };

    document.getElementById("footerSave")!.onclick = function(this : GlobalEventHandlers,ev : MouseEvent)
    {
        contig.alias = editedAlias;
        let colour : string = (<string>(<any>$(document.getElementById("fillColourPicker")!)).minicolors("rgbString"));
        let fontColour : string = (<string>(<any>$(document.getElementById("fontColourPicker")!)).minicolors("rgbString"));
        contig.color = colour;
        contig.fontFill = fontColour;
        if(contig.allowPositionChange)
        {
            let vAdjust = parseInt((<HTMLInputElement>document.getElementById("vAdjust")).value);
            let start = parseInt((<HTMLInputElement>document.getElementById("start")).value);
            let end = parseInt((<HTMLInputElement>document.getElementById("end")).value);
            contig.vAdjust = vAdjust;
            contig.start = start;
            contig.end = end;

        }
        masterView.contigEditorModalOpen = false;
        masterView.dismissModal();
        genomeView.firstRender = true;
        masterView.saveFigureChanges();
        viewMgr.render();
    
    };

    document.getElementById("contigAlias")!.onclick = function(this : GlobalEventHandlers,ev : MouseEvent)
    {
        masterView.dismissModal();
        dialogs.prompt("Contig Name",editedAlias,function(text : string)
        {
            if(text)
                editedAlias = text;
            masterView.showModal();
            viewMgr.render();
        });
    };
    if(contig.allowPositionChange)
    {
        document.getElementById("deleteContig")!.onclick = function(this : GlobalEventHandlers,ev : MouseEvent)
        {
            masterView.dismissModal();
            dialogs.confirm("This cannot be undone",function(ok : boolean)
            {
                if(ok)
                {
                    for(let i = genomeView.genome.customContigs.length - 1; i != -1; i--)
                    {
                        if(genomeView.genome.customContigs[i].uuid == contig.uuid)
                        {
                            genomeView.genome.customContigs.splice(i,1);
                            document.getElementById("footerSave")!.click();
                        }
                    }
                }
            });
        };
    }
    let colourPicker = document.getElementById("fillColourPicker");
    (<any>$(colourPicker!)).minicolors({
        control : "hue",
        defaultValue : "",
        format : "rgb",
        keywords : "",
        inline : false,
        swatches : [],
        theme : "default",
        change : function(hex : string,opacity : string)
        {}
    });
    let fontColourPicker = document.getElementById("fontColourPicker");
    (<any>$(fontColourPicker!)).minicolors({
        control : "hue",
        defaultValue : "",
        format : "rgb",
        keywords : "",
        inline : false,
        swatches : [],
        theme : "default",
        change : function(hex : string,opacity : string)
        {}
    });
}