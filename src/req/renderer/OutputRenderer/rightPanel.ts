import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";

export class FastQInfoSelection
{
    public alias : boolean;
    public fullName : boolean;
    public sizeInBytes : boolean;
    public formattedSize : boolean;
    public numberOfSequences : boolean;
    public PBSQ : boolean;
    public PSQS : boolean;
    public PSGCC : boolean;
    public SDL : boolean;
    public ORS : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.alias = false;
        this.fullName = false;
        this.sizeInBytes = false;
        this.formattedSize = false;
        this.numberOfSequences = false;
        this.PBSQ = false;
        this.PSQS = false;
        this.PSGCC = false;
        this.SDL = false;
        this.ORS = false;
    }
    
}

export class FastaInfoSelection
{
    [index : string] : boolean;
}

export class AlignmentInfoSelection
{
    public alias : boolean;
    public sizeInBytes : boolean;
    public formattedSize : boolean;
    public reads : boolean;
    public mates : boolean;
    public overallAlignmentRate : boolean;
    public minimumCoverage : boolean;
    public minimumVariableFrequency : boolean;
    public minimumAverageQuality : boolean;
    public pValueThreshold : boolean;
    public SNPsPredicted : boolean;
    public indelsPredicted : boolean;
    public dateRan : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.alias = false;
        this.fullName = false;
        this.sizeInBytes = false;
        this.formattedSize = false;
        this.reads = false;
        this.mates = false;
        this.overallAlignmentRate = false;
        this.minimumCoverage = false;
        this.minimumVariableFrequency = false;
        this.minimumAverageQuality = false;
        this.pValueThreshold = false;
        this.SNPsPredicted = false;
        this.indelsPredicted = false;
        this.dateRan = false;
        this.SNPPositions = false;
    }
}

export class SNPPositionsInfoSelection
{
    public chrom : boolean;
    public position : boolean;
    public ref : boolean;
    public var : boolean;
    public consCovReads1Reads2FreqPValue : boolean;
    public strandFilterR1R1R2R2pVal : boolean;
    public samplesRef : boolean;
    public samplesHet : boolean;
    public samplesHom : boolean;
    public samplesNC : boolean;
    public consCovReads1Reads2FreqPValue2 : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.chrom = true;
        this.position = true;
        this.ref = true;
        this.var = true;
        this.consCovReads1Reads2FreqPValue = false;
        this.strandFilterR1R1R2R2pVal = false;
        this.samplesRef = false;
        this.samplesHet = false;
        this.samplesHom = false;
        this.samplesNC = false;
        this.consCovReads1Reads2FreqPValue2 = false;
    }
}

export class View extends viewMgr.View
{
    public fastQInfoSelection : FastQInfoSelection;
    public refSeqInfoSelection : FastaInfoSelection;
    public alignmentInfoSelection : AlignmentInfoSelection;
    public snpPositionsInfoSelection : SNPPositionsInfoSelection;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.fastQInfoSelection = new FastQInfoSelection();
        this.refSeqInfoSelection = new FastaInfoSelection();
        this.alignmentInfoSelection = new AlignmentInfoSelection();
        this.snpPositionsInfoSelection = new SNPPositionsInfoSelection();
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
                    `;
                }

                if(masterView.displayInfo == "SNPPositions")
                {
                    res += `


                        ${(()=>{
                            let inspectingAlignMarkup = "";
                            for(let i = 0; i != masterView.alignData.length; ++i)
                            {
                                if(masterView.inspectingUUID == masterView.alignData[i].uuid)
                                {
                                    inspectingAlignMarkup += `
                                        <h5>SNP Reporting for ${masterView.alignData[i].alias}</h5>
                                    `;
                                    return inspectingAlignMarkup;
                                }
                            }
                            throw new Error("No alignment to inspect");
                        })()}


                        <input type="checkbox" id="chrom">Chrom</input>
                        <br />

                        <input type="checkbox" id="position">Position</input>
                        <br />

                        <input type="checkbox" id="ref">Ref</input>
                        <br />

                        <input type="checkbox" id="var">Var</input>
                        <br />

                        <input type="checkbox" id="consCovReads1Reads2FreqPValue">Cons:Cov:Reads1:Reads2:Freq:P-value</input>
                        <br />

                        <input type="checkbox" id="strandFilterR1R1R2R2pVal">StrandFilter:R1+:R1-:R2+:R2-:pval</input>
                        <br />

                        <input type="checkbox" id="samplesRef">SamplesRef</input>
                        <br />

                        <input type="checkbox" id="samplesHet">SamplesHet</input>
                        <br />

                        <input type="checkbox" id="samplesHom">SamplesHom</input>
                        <br />

                        <input type="checkbox" id="samplesNC">SamplesNC</input>
                        <br />

                        <input type="checkbox" id="consCovReads1Reads2FreqPValue2">Cons:Cov:Reads1:Reads2:Freq:P-value</input>
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
                //restore tab radios
                (<HTMLInputElement>document.getElementById("QCInfo")).checked = true;
                //restore individual options checkboxs
                for(let i in this.fastQInfoSelection)
                {
                    try
                    {
                        (<HTMLInputElement>document.getElementById(i)).checked = this.fastQInfoSelection[i];
                    }
                    catch(err){}
                }
            }
            if(masterView.displayInfo == "RefSeqInfo")
            {
                (<HTMLInputElement>document.getElementById("RefSeqInfo")).checked = true;
                for(let i in this.refSeqInfoSelection)
                {
                    if(this.refSeqInfoSelection.hasOwnProperty(i))
                    {
                        try
                        {
                            (<HTMLInputElement>document.getElementById(i)).checked = this.refSeqInfoSelection[i];
                        }
                        catch(err){}
                    }
                }
            }
            if(masterView.displayInfo == "AlignmentInfo")
            {
                (<HTMLInputElement>document.getElementById("AlignmentInfo")).checked = true;
                for(let i in this.alignmentInfoSelection)
                {
                    if(this.alignmentInfoSelection.hasOwnProperty(i))
                    {
                        try
                        {
                            (<HTMLInputElement>document.getElementById(i)).checked = this.alignmentInfoSelection[i];
                        }
                        catch(err){}
                    }
                }
            }
            if(masterView.displayInfo == "SNPPositions")
            {
                for(let i in this.snpPositionsInfoSelection)
                {
                    if(this.snpPositionsInfoSelection.hasOwnProperty(i))
                    {
                        try
                        {
                            (<HTMLInputElement>document.getElementById(i)).checked = this.snpPositionsInfoSelection[i];
                        }
                        catch(err){}
                    }
                }
            }
        }
        catch(err){}
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        if(event.target.id == "QCInfo" || event.target.id == "RefSeqInfo" || event.target.id == "AlignmentInfo")
        {
            masterView.displayInfo = event.target.id;
            viewMgr.render();
            return;
        }
        if(event.target.id)
        {
            let checked = (
                <HTMLInputElement>document.getElementById(event.target.id)
            ).checked;
            if(masterView.displayInfo == "QCInfo")
            {
                this.fastQInfoSelection[event.target.id] = checked;
                viewMgr.render();
                return;
            }
            else if(masterView.displayInfo == "RefSeqInfo")
            {
                this.refSeqInfoSelection[event.target.id] = checked;
                viewMgr.render();
                return;
            }
            else if(masterView.displayInfo == "AlignmentInfo")
            {
                    
                this.alignmentInfoSelection[event.target.id] = checked;
                viewMgr.render();
                return;
            }
            else if(masterView.displayInfo == "SNPPositions")
            {
                this.snpPositionsInfoSelection[event.target.id] = checked;
                viewMgr.render();
                return;
            }
        }
    }
}

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View("rightPanel",div));
}