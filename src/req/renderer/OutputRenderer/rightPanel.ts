import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";

export interface FastQInfoSelection
{
    alias : boolean;
    fullName : boolean;
    sizeInBytes : boolean;
    formattedSize : boolean;
    numberOfSequences : boolean;
    PBSQ : boolean;
    PSQS : boolean;
    PSGCC : boolean;
    SDL : boolean;
    ORS : boolean;
}

export interface FastaInfoSelection
{

}

export interface AlignmentInfoSelection
{

}

export class RightPanel extends viewMgr.View
{
    public fastQInfoSelection : FastQInfoSelection;
    public fastaInfoSelection : FastaInfoSelection;
    public alignmentInfoSelection : AlignmentInfoSelection;
    public constructor(name : string,div : string)
    {
        super(name,div);
    }

    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <div>
                <div style="display:inline-block;">
                    <input style="display:inline-block;" id="QCRadio" type="radio" name="selectedInfo" />
                        <p style="display:inline-block;">FastQ QC Info</p>
                </div>

                <div style="display:inline-block;">
                    <input style="display:inline-block;" id="RefSeqRadio" type="radio" name="selectedInfo" />
                        <p style="display:inline-block;">Ref Seq Info</p>
                </div>

                <div style="display:inline-block;">
                    <input style="display:inline-block;" id="AlignRadio" type="radio" name="selectedInfo" />
                        <p style="display:inline-block;">Alignment Info</p>
                </div>
            </div>
            ${(()=>{
                let res = "";

                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                if(masterView.displayInfo == "QCInfo" && masterView.fastqInputs)
                {

                }

                return res;
            })()}
        `;
    }

    public postRender() : void
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        try
        {
            if(masterView.displayInfo == "QCInfo")
            {
                (<HTMLInputElement>document.getElementById("QCRadio")).checked = true;
            }
            if(masterView.displayInfo == "RefSeqInfo")
            {
                (<HTMLInputElement>document.getElementById("RefSeqRadio")).checked = true;
            }
            if(masterView.displayInfo == "AlignmentInfo")
            {
                (<HTMLInputElement>document.getElementById("AlignRadio")).checked = true;
            }
        }
        catch(err){}
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {

    }
}

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new RightPanel("rightPanel",div));
}