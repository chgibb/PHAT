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
    let foundTrack = false;
    for(let i = 0; i != genomeView.genome.renderedCoverageTracks.length; ++i)
    {
        if(genomeView.genome.renderedCoverageTracks[i].uuidAlign == selectedAlign.uuid)
        {
            for(let j = 0; j != selectedAlign.fasta.contigs.length; ++j)
            {
                if(genomeView.genome.renderedCoverageTracks[i].uuidContig == selectedAlign.fasta.contigs[j].uuid)
                {
                    body += `
                        <p id="${genomeView.genome.renderedCoverageTracks[i].uuid}Available" class="activeHover" style="color:${genomeView.genome.renderedCoverageTracks[i].colour}">${selectedAlign.fasta.contigs[j].name}</p>
                    `;
                    foundTrack = true;
                }
            }
        }
    }
    if(!foundTrack)
    {
        body += `
            <p>No coverage tracks available</p>
        `;
    }

    foundTrack = false;
    body += `
        <h5>SNPs</h5>
    `;
    for(let i = 0; i != genomeView.genome.renderedSNPTracks.length; ++i)
    {
        if(genomeView.genome.renderedSNPTracks[i].uuidAlign == selectedAlign.uuid)
        {
            for(let j = 0; j != selectedAlign.fasta.contigs.length; ++j)
            {
                if(genomeView.genome.renderedSNPTracks[i].uuidContig == selectedAlign.fasta.contigs[j].uuid)
                {
                    body += `
                        <p id="${genomeView.genome.renderedSNPTracks[i].uuid}Available" class="activeHover" style="color:${genomeView.genome.renderedSNPTracks[i].colour}" >${selectedAlign.fasta.contigs[j].name}</p>
                    `;
                    foundTrack = true;
                }
            }
        }
    }
    if(!foundTrack)
    {
        body += `
            <p>No SNP tracks available</p>
        `;
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
        for(let i = 0; i != genomeView.genome.renderedCoverageTracks.length; ++i)
        {
            //save changes to selected tracks
            let el = document.getElementById(`${genomeView.genome.renderedCoverageTracks[i].uuid}Available`);
            if(el)
            {
                if(el.classList.contains("selected"))
                    genomeView.genome.renderedCoverageTracks[i].checked = true;
                else
                    genomeView.genome.renderedCoverageTracks[i].checked = false;
                genomeView.firstRender = true;
            }
        }

        for(let i = 0; i != genomeView.genome.renderedSNPTracks.length; ++i)
        {
            //save changes to selected tracks
            let el = document.getElementById(`${genomeView.genome.renderedSNPTracks[i].uuid}Available`);
            if(el)
            {
                if(el.classList.contains("selected"))
                    genomeView.genome.renderedSNPTracks[i].checked = true;
                else
                    genomeView.genome.renderedSNPTracks[i].checked = false;
                genomeView.firstRender = true;
            }
        }

        masterView.availableTracksModalOpen = false;
        masterView.dismissModal();
        masterView.dataChanged();
        viewMgr.render();
    }
    for(let i = 0; i != genomeView.genome.contigs.length; ++i)
    {
        //this will throw for the filler contig that doesn't not get a control rendered for it
        try
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

            document.getElementById(`${genomeView.genome.contigs[i].uuid}GenSNPs`).onclick = function(this : HTMLElement,ev : MouseEvent){
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "renderSNPTrackForContig",
                        figureuuid : genomeView.genome.uuid,
                        alignuuid : selectedAlign.uuid,
                        uuid : genomeView.genome.contigs[i].uuid,
                        colour : (<string>(<any>$(document.getElementById("colourPicker"))).minicolors("rgbString"))
                    }
                );
            }
        }
        catch(err){}
    }
    for(let i = 0; i != genomeView.genome.renderedCoverageTracks.length; ++i)
    {
        //select and unselect available tracks onclick
        let el = document.getElementById(`${genomeView.genome.renderedCoverageTracks[i].uuid}Available`);
        if(el)
        {
            if(genomeView.genome.renderedCoverageTracks[i].checked)
            {
                el.classList.add("selected");
            }
            el.onclick = function(this : HTMLElement,ev : MouseEvent){
                if(el.classList.contains("selected"))
                    el.classList.remove("selected");
                else
                    el.classList.add("selected");
            }
        }
    }

    for(let i = 0; i != genomeView.genome.renderedSNPTracks.length; ++i)
    {
        //select and unselect available tracks onclick
        let el = document.getElementById(`${genomeView.genome.renderedSNPTracks[i].uuid}Available`);
        if(el)
        {
            if(genomeView.genome.renderedSNPTracks[i].checked)
            {
                el.classList.add("selected");
            }
            el.onclick = function(this : HTMLElement,ev : MouseEvent){
                if(el.classList.contains("selected"))
                    el.classList.remove("selected");
                else
                    el.classList.add("selected");
            }
        }
    }
}