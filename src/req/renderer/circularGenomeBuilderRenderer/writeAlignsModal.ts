import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {writeAvailableTracksModal,setSelectedAlign} from "./writeAvailableTracksModal";
import {getReadable} from "./../../getAppPath";
/**
 * Writes the alignment selection menu into the modal
 * 
 * @export
 */
export function writeAlignsModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let aligns = masterView.getAlignsForOpenGenome();

    let title = `Select Alignment`;

    let body = ``;
    if(!genomeView.genome)
    {
        body = `
            <p>You must select a figure to edit before you can view it's coverage options.</p>
        `;
    }
    else if(genomeView.genome)
    {
        if(!aligns)
        {
            body = `
                <p>Run alignments with this reference to generate coverage data to visualize.</p>
            `;
        }
        else
        {
            body = `
                <table style="width:100;">
                    <tr>
                        <th>Options</th>
                        <th>Name</th>
                        <th>Reads</th>
                        <th>Mates</th>
                        <th>Overall Alignment Rate %</th>
                        <th>Date Ran</th>
                    </tr>
            `;
            for(let i = 0; i != aligns.length; ++i)
            {
                body += `
                    <tr>
                        ${(()=>{
                            if(masterView.willBLASTAlignment)
                            {
                                if(genomeView.shouldAllowTriggeringOps)
                                    return `<td id="${aligns[i].uuid}View" class="cellHover">BLAST</td>`;
                                else
                                    return `<td><div class="three-quarters-loader"></div></td>`
                            }
                            return `<td><img src="${getReadable("img/viewAvailableTracks.png")}" id="${aligns[i].uuid}View" class="activeHover activeHoverButton" /><br />
                            </td>`;

                        })()}
                        <td>${aligns[i].alias}</td>
                        <td>${!aligns[i].isExternalAlignment ? aligns[i].summary.reads : aligns[i].flagStatReport.reads}</td>
                        <td>${!aligns[i].isExternalAlignment ? aligns[i].summary.mates : "Unknown"}</td>
                        <td>${!aligns[i].isExternalAlignment ? aligns[i].summary.overallAlignmentRate : aligns[i].flagStatReport.overallAlignmentRate}</td>
                        <td>${aligns[i].dateStampString}</td>
                    </tr>
                `;
            }
            body += `</table>`;
        }
    }

    let footer = ``;
    if(!genomeView.genome)
    {
        footer = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Got It</button>
        `;
    }
    if(genomeView.genome)
    {
        footer += `
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
            ${masterView.willBLASTAlignment == false ? `<button type="button" class="btn btn-primary" id="footerSave">Save changes</button>` : ""}
        `;
    }

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;
    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.alignsModalOpen = false;
    }
    if(genomeView.genome)
    {
        if(!masterView.willBLASTAlignment)
        {
            document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
                masterView.alignsModalOpen = false;
                masterView.dismissModal();
            }
        }
    }
    if(aligns)
    {
        for(let i = 0; i != aligns.length; ++i)
        {
            document.getElementById(`${aligns[i].uuid}View`).onclick = function(this : HTMLElement,ev : MouseEvent){
                if(masterView.willBLASTAlignment)
                {
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "BLASTSegment",
                            align : aligns[i],
                            start : genomeView.seqSelectionArrow.arrowStart,
                            stop : genomeView.seqSelectionArrow.arrowEnd
                        }
                    );
                    return;
                }
                masterView.alignsModalOpen = false;
                masterView.availableTracksModalOpen = true;
                setSelectedAlign(aligns[i]);
                writeAvailableTracksModal();
            }
        }
    }
    
}