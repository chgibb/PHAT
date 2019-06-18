import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";

/**
 * Writes the list of contigs to edit into the modal
 * 
 * @export
 */
export function writeEditContigsModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = "Select Contig to Edit";

    let body = "";
    if(!genomeView.genome)
    {
        body = `
            <p>You must select a figure to edit before you can view it's contigs to edit.</p>
        `;
    }
    else if(genomeView.genome)
    {
        body += "<h5>Custom Contigs</h5>";
        if(genomeView.genome.customContigs.length > 0)
        {
            for(let i = 0; i != genomeView.genome.customContigs.length; ++i)
            {
                body += `<p class="activeHover" id="${genomeView.genome.customContigs[i].uuid}Edit">${genomeView.genome.customContigs[i].name}</p>`;
            }
        }
        else
        {
            body += "<p>No custom contigs</p>";
        }

        body += "<h5>Reference Contigs</h5>";

        for(let i = 0; i != genomeView.genome.contigs.length; ++i)
        {
            body += `<p class="activeHover" id="${genomeView.genome.contigs[i].uuid}Edit">${genomeView.genome.contigs[i].name}</p>`;
        }
    }

    let footer = "";

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;

    if(genomeView.genome.customContigs.length > 0)
    {
        for(let i = 0; i != genomeView.genome.customContigs.length; ++i)
        {
            document.getElementById(`${genomeView.genome.customContigs[i].uuid}Edit`).onclick = function(this : HTMLElement,ev : MouseEvent)
            {
                genomeView.markerOnClick(undefined,undefined,genomeView.genome.customContigs[i].uuid);
            };
        }
    }
    
    for(let i = 0; i != genomeView.genome.contigs.length; ++i)
    {
        document.getElementById(`${genomeView.genome.contigs[i].uuid}Edit`).onclick = function(this : HTMLElement,ev : MouseEvent)
        {
            genomeView.markerOnClick(undefined,undefined,genomeView.genome.contigs[i].uuid);
        };
    }
}