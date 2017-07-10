import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
export function writeAlignsModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Coverage Options`;

    let body = ``;
    if(!genomeView.genome)
    {
        body = `
            <p>You must select a figure to edit before you can view it's coverage options.</p>
        `;
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
                //alert("footerClose");
    }
    if(genomeView.genome)
    {
        document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
            //alert("footerSave");
            masterView.dismissModal();
        }
    }
}