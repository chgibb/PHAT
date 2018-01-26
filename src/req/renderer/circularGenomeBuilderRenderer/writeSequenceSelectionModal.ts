import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";

/**
 * Writes the sequence selection interface into the modal
 * 
 * @export
 */
export function writeSequenceSelectionModal() : void
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    let title = `Select Genomic Sequence`;

    let body = `
        <h5>Start</h5>
        <input type="number" id="" value="${genomeView.seqSelectionLeftArm.armStart}" />
        <br />
        <h5>End</h5>
        <input type="number" id="" value="${genomeView.seqSelectionRightArm.armStart}" />
    `;

    let footer = ``;

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;
}