import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import {writeAvailableTracksModal} from "./writeAvailableTracksModal";
export function writeAlignsModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let aligns = masterView.getAlignsForOpenGenome();

    let title = `Coverage Options`;

    let body = ``;
    if(!genomeView.genome)
    {
        body = `
            <p>You must select a figure to edit before you can view it's coverage options.</p>
        `;
    }
    else if(genomeView.genome)
    {
        if(!masterView.getAlignsForOpenGenome())
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
                        <td><button id="${aligns[i].uuid}View">View Available Tracks</button><br />
                        </td>
                        <td>${aligns[i].alias}</td>
                        <td>${aligns[i].summary.reads}</td>
                        <td>${aligns[i].summary.mates}</td>
                        <td>${aligns[i].summary.overallAlignmentRate}</td>
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
            <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
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
        document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
            //alert("footerSave");
            masterView.alignsModalOpen = false;
            masterView.dismissModal();
        }
    }
    for(let)
    
}