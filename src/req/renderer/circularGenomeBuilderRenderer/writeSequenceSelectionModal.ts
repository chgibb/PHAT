import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as genomeView from "./genomeView";
import {writeSeqSelectionActionModal} from "./writeSequenceSelectionActionModal";

function valSelectionStartAndEnd() : void
{
    let startInput : HTMLInputElement = (<HTMLInputElement>document.getElementById("seqSelectionStart"));
    let endInput : HTMLInputElement = (<HTMLInputElement>document.getElementById("seqSelectionEnd"));

    let startInputValue = parseInt(startInput.value);
    let endInputValue = parseInt(endInput.value);

    if(startInputValue <= 0 || !startInputValue)
        startInput.value = "1";
    
    if(endInputValue <= 1 || !endInputValue)
        endInput.value = "2";
    
    if(startInputValue >= endInputValue)
        startInput.value = (endInputValue - 1).toString();
}

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
        <h5>End</h5>
        <input type="number" id="seqSelectionEnd" value="${genomeView.seqSelectionRightArm.armStart}" />
        <br />
        <br />
        <h5>Start</h5>
        <input type="number" id="seqSelectionStart" value="1" />
    `;

    let footer = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Cancel</button>
        <button type="button" class="btn btn-primary" id="selectSequence">Select Sequence</button>
    `;
    if(!genomeView.genome.isInteractive)
    {
        footer += `
        <button type="button" class="btn btn-primary" id="updateSeqSelection">Update Range on Figure</button>
        `;
    }

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;

    document.getElementById("selectSequence").onclick = function(this : HTMLElement,ev : MouseEvent){
        masterView.seqSelectionModalOpen = false;
        masterView.seqSelectionActionModalOpen = true;
        writeSeqSelectionActionModal();
    }

    if(genomeView.genome.isInteractive)
    {
        document.getElementById("seqSelectionStart").oninput = function(this : HTMLElement,ev : Event){
            valSelectionStartAndEnd();
            updateSeqSelectionOnFigure(parseInt((<HTMLInputElement>document.getElementById("seqSelectionStart")).value),undefined);
        }

        document.getElementById("seqSelectionEnd").oninput = function(this : HTMLElement,ev : Event){
            valSelectionStartAndEnd();
            updateSeqSelectionOnFigure(undefined,parseInt((<HTMLInputElement>document.getElementById("seqSelectionEnd")).value));
        }
    }
    if(!genomeView.genome.isInteractive)
    {
        document.getElementById("updateSeqSelection").onclick = function(this : HTMLElement,ev : MouseEvent){
            valSelectionStartAndEnd();
            updateSeqSelectionOnFigure(
                parseInt((<HTMLInputElement>document.getElementById("seqSelectionStart")).value),
                parseInt((<HTMLInputElement>document.getElementById("seqSelectionEnd")).value)
            );
        }
    }

}

function updateSeqSelectionOnFigure(start : number,end : number)
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);

    if(genomeView.genome.isInteractive)
    {
        if(start !== undefined)
        {
            if(start < 0)
                return;
            if(start > genomeView.seqSelectionRightArm.armStart)
                return;
            genomeView.seqSelectionLeftArm.armStart = start;
            genomeView.seqSelectionArrow.arrowStart = start;
        }
        if(end !== undefined)
        {
            if(end < genomeView.seqSelectionLeftArm.armStart)
                return;
            genomeView.seqSelectionRightArm.armStart = end;
            genomeView.seqSelectionArrow.arrowEnd = end;
        }

        genomeView.seqSelectionArrow.updateText();
   
        //get div controlled by Angular
        let divToCompile : HTMLElement = document.getElementById("toCompile");
        let scope = angular.element(divToCompile).scope();
        //apply changes to update selection
        scope.$apply();
    }

    if(!genomeView.genome.isInteractive)
    {
        if(start > end)
            return;

        genomeView.seqSelectionLeftArm.armStart = start;
        genomeView.seqSelectionArrow.arrowStart = start;
        genomeView.seqSelectionRightArm.armStart = end;
        genomeView.seqSelectionArrow.arrowEnd = end;

        genomeView.seqSelectionArrow.updateText();
        
        genomeView.firstRender = true;
        viewMgr.render();
    }
}
