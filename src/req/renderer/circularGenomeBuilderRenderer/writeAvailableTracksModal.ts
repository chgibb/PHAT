import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import {alignData} from "./../../alignData";
export function writeAvailableTracksModal(align : alignData) : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Track Options`;

    let body = ``;

    let footer = ``;

    footer += `
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
            <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
        `;                          
    

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;
    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.availableTracksModalOpen = false;
    }
    document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
            masterView.availableTracksModalOpen = false;
            masterView.dismissModal();
        }
}