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
    [index : string] : boolean;
}

export interface FastaInfoSelection
{
    [index : string] : boolean;
}

export interface AlignmentInfoSelection
{
    alias : boolean;
    sizeInBytes : boolean;
    formattedSize : boolean;
    reads : boolean;
    mates : boolean;
    overallAlignmentRate : boolean;
    minimumCoverage : boolean;
    minimumVariableFrequency : boolean;
    minimumAverageQuality : boolean;
    pValueThreshold : boolean;
    SNPsPredicted : boolean;
    indelsPredicted : boolean;
    dateRan : boolean;
    SNPPositions : boolean;
    [index : string] : boolean;
}

export class RightPanel extends viewMgr.View
{
    public fastQInfoSelection : FastQInfoSelection;
    public refSeqInfoSelection : FastaInfoSelection;
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
                    <input style="display:inline-block;" id="QCInfo" type="radio" name="selectedInfo" />
                        <p style="display:inline-block;">FastQ QC Info</p>
                </div>

                <div style="display:inline-block;">
                    <input style="display:inline-block;" id="RefSeqInfo" type="radio" name="selectedInfo" />
                        <p style="display:inline-block;">Ref Seq Info</p>
                </div>

                <div style="display:inline-block;">
                    <input style="display:inline-block;" id="AlignmentInfo" type="radio" name="selectedInfo" />
                        <p style="display:inline-block;">Alignment Info</p>
                </div>
            </div>
            ${(()=>{
                let res = "";
                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                if(masterView.displayInfo == "QCInfo")
                {
                    res += `
                        <input type="checkbox" id="alias">Alias</input>
                        <input type="checkbox" id="fullName">Full Path</input>
                        <input type="checkbox" id="sizeInBytes">Size In Bytes</input>
                        <input type="checkbox" id="formattedSize">Formatted Size</input>
                        <br />
                        
                        <input type="checkbox" id="numberOfSequences">Number of Sequences</input>
                        <br />

                        <input type="checkbox" id="PBSQ">Per Base Sequence Quality</input>
                        <br />

                        <input type="checkbox" id="PSQS">Per Sequence Quality Score</input>
                        <br />

                        <input type="checkbox" id="PSGCC">Per Sequence GC Content</input>
                        <br />

                        <input type="checkbox" id="SDL">Sequence Duplication Levels</input>
                        <br />

                        <input type="checkbox" id="ORS">Over Represented Sequences</input>
                    `;
                }
                if(masterView.displayInfo == "RefSeqInfo")
                {
                    res += `

                    `;
                }
                if(masterView.displayInfo == "AlignmentInfo")
                {
                    res += `
                        <input type="checkbox" id="alias">Alias</input>
                        <input type="checkbox" id="sizeInBytes">Size In Bytes</input>
                        <input type="checkbox" id="formattedSize">Formatted Size</input>
                        <br />

                        <input type="checkbox" id="reads">Reads</input>
                        <br />

                        <input type="checkbox" id="mates">Mates</input>
                        <br />

                        <input type="checkbox" id="overallAlignmentRate">Overall Alignment Rate %</input>
                        <br />

                        <input type="checkbox" id="minimumCoverage">Minimum Coverage</input>
                        <br />

                        <input type="checkbox" id="minimumVariableFrequency">Minimum Variable Frequency</input>
                        <br />

                        <input type="checkbox" id="minimumAverageQuality">Minimum Average Quality</input>
                        <br />

                        <input type="checkbox" id="pValueThreshold">P-Value Threshold</input>
                        <br />

                        <input type="checkbox" id="SNPsPredicted">SNPs Predicted</input>
                        <br />

                        <input type="checkbox" id="indelsPredicted">Indels Predicted</input>
                        <br />

                        <input type="checkbox" id="dateRan">Date Ran</input>
                        <br />

                        <input type="checkbox" id="SNPPositions">SNP Positions</input>
                        <br />
                    `;
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
                (<HTMLInputElement>document.getElementById("QCInfo")).checked = true;
            }
            if(masterView.displayInfo == "RefSeqInfo")
            {
                (<HTMLInputElement>document.getElementById("RefSeqInfo")).checked = true;
            }
            if(masterView.displayInfo == "AlignmentInfo")
            {
                (<HTMLInputElement>document.getElementById("AlignmentInfo")).checked = true;
            }
        }
        catch(err){}
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        console.log(event.target.id);
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        if(event.target.id == "QCInfo" || event.target.id == "RefSeqInfo" || event.target.id == "AlignmentInfo")
        {
            masterView.displayInfo = event.target.id;
            viewMgr.render();
            return;
        }
        try
        {
            if(event.target.id)
            {
                if(masterView.displayInfo == "QCInfo")
                {
                    this.fastQInfoSelection[event.target.id] = true;
                    return;
                }
                else if(masterView.displayInfo == "RefSeqInfo")
                {
                    this.refSeqInfoSelection[event.target.id] = true;
                    return;
                }
                else if(masterView.displayInfo == "AlignmentInfo")
                {
                    this.alignmentInfoSelection[event.target.id] = true;
                    return;
                }
            }
        }
        catch(err){}
    }
}

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new RightPanel("rightPanel",div));
}