import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import * as cf from "./../circularFigure";
let contig : cf.Contig;
export function setSelectedContigByUUID(uuid : string) : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    for(let i = 0; i != genomeView.genome.contigs.length; ++i)
    {
        if(genomeView.genome.contigs[i].uuid == uuid)
        {
            contig = genomeView.genome.contigs[i];
            return;
        }
    }

    for(let i = 0; i != genomeView.genome.customContigs.length; ++i)
    {
        if(genomeView.genome.customContigs[i].uuid == uuid)
        {
            contig = genomeView.genome.customContigs[i];
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
    
    }
}