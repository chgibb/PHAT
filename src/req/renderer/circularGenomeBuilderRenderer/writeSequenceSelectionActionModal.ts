import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";

/**
 * writes the sequence selection action interface into the modal
 * 
 * @export
 */
export function writeSeqSelectionActionModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Selected ${genomeView.seqSelectionLeftArm.armStart} to ${genomeView.seqSelectionRightArm.armStart}`;

    let body = ``;

    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
    `;

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;
}
