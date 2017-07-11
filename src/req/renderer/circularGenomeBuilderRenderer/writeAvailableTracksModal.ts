import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import {alignData} from "./../../alignData";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
require("@claviska/jquery-minicolors");
let selectedAlign : alignData;
export function setSelectedAlign(align : alignData) : void
{
    selectedAlign = align;
}
export function writeAvailableTracksModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Track Options`;

    let body = `
        <h4>Available Tracks</h4>   
        <h5>Coverage</h5>
    `;
    for(let i = 0; i != genomeView.genome.renderedCoverageTracks.length; ++i)
    {
        if(genomeView.genome.renderedCoverageTracks[i].uuidAlign == selectedAlign.uuid)
        {
            for(let j = 0; j != selectedAlign.fasta.contigs.length; ++j)
            {
                if(genomeView.genome.renderedCoverageTracks[i].uuidContig == selectedAlign.fasta.contigs[j].uuid)
                {
                    body += `
                        <p>${selectedAlign.fasta.contigs[j].name}</p>
                    `;
                }
            }
        }
    }

    body += `
        <h4>Create New Tracks</h4>
        <input type="text" id="colourPicker" data-format="rgb" value="rgb(0, 0, 0)">
    `;
    for(let i = 0; i != genomeView.genome.contigs.length; ++i)
    {
        if(genomeView.genome.contigs[i].uuid != "filler")
        {
            body += `
                <div>
                    <p style="display:inline-block;">${genomeView.genome.contigs[i].name}</p>
                    <input style="display:inline-block;" type="button" id="${genomeView.genome.contigs[i].uuid}GenCoverage" value="Generate Coverage Track" />
                    <input style="display:inline-block;" type="button" id="${genomeView.genome.contigs[i].uuid}GenSNPs" value="Generate SNP Track" />
                </div>
            `;
        }
    }

    let footer = ``;

    footer += `
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
            <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
        `;                          
    

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;

    let colourPicker = document.getElementById("colourPicker");
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

    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.availableTracksModalOpen = false;
    }
    document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
            masterView.availableTracksModalOpen = false;
            masterView.dismissModal();
    }
    for(let i = 0; i != genomeView.genome.contigs.length; ++i)
    {
        document.getElementById(`${genomeView.genome.contigs[i].uuid}GenCoverage`).onclick = function(this : HTMLElement,ev : MouseEvent){
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "renderCoverageTrackForContig",
                    figureuuid : genomeView.genome.uuid,
                    alignuuid : selectedAlign.uuid,
                    uuid : genomeView.genome.contigs[i].uuid,
                    colour : (<string>(<any>$(document.getElementById("colourPicker"))).minicolors("rgbString"))
                }
            );
        }
    }
}