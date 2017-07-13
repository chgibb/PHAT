import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import * as cf from "./../circularFigure";
import {reCacheBaseFigure} from "./reCacheBaseFigure";
import {writeLoadingModal} from "./writeLoadingModal";
export function writeContigCreatorModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Create New Contig`;
    let body = `
        <h5>Start</h5>
        <input type="text" id="contigStart" />
        </br >
        <h5>End</h5>
        <input type="text" id="contigEnd" />
    `;

    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
        <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
    `;

    if(!genomeView.genome)
    {
        body = `
            <p>You must select a figure to edit before you can add contigs to it</p>
        `;
        footer = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Got It</button>
        `;
    }

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;

    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.contigCreatorModalOpen = false;
    }

    if(genomeView.genome)
    {
        document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){

            let contig : cf.Contig = new cf.Contig();
            cf.initContigForDisplay(contig);
            contig.start = parseInt((<HTMLInputElement>document.getElementById("contigStart")).value);
            contig.end = parseInt((<HTMLInputElement>document.getElementById("contigEnd")).value);

            contig.alias = "New Contig";
            contig.name = "Custom Contig";
            genomeView.genome.customContigs.push(contig);

            masterView.contigCreatorModalOpen = false;
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
    }

}
