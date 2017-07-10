import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
export function writeAlignsModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");

    let title = `Coverage Options`;

    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Close</button>
        <button type="button" class="btn btn-primary" id="footerSave">Save changes</button>
    `;

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalFooter").innerHTML = footer;
    document.getElementById("footerClose").onclick = function(this : HTMLElement,ev : MouseEvent){
                //alert("footerClose");
    }
    document.getElementById("footerSave").onclick = function(this : HTMLElement,ev : MouseEvent){
        //alert("footerSave");
        masterView.dismissModal();
    }
}