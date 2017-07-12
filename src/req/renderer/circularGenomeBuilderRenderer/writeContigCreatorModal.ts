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
    let body = ``;

    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
        <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
    `;

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;

    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.contigCreatorModalOpen = false;
    }

    document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.contigCreatorModalOpen = false;
        masterView.dismissModal();
        viewMgr.render();
    }

}
