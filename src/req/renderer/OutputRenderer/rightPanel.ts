import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as reportView from "./reportView";
import {Mangle} from "./../../mangle";
import {CSVExportDialog} from "./CSVExportDialog";
import {XLSExportDialog} from "./XLSExportDialog";

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
        this.alias = true;
        this.fullName = false;
        this.sizeInBytes = false;
        this.formattedSize = true;
        this.numberOfSequences = false;
        this.PBSQ = true;
        this.PSQS = true;
        this.PSGCC = true;
        this.SDL = true;
        this.ORS = true;
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
    public aligner : boolean;
    public reads : boolean;
    public mates : boolean;
    public overallAlignmentRate : boolean;
    public minimumCoverage : boolean;
    public minimumVariableFrequency : boolean;
    public minimumAverageQuality : boolean;
    public pValueThreshold : boolean;
    public SNPsPredicted : boolean;
    public indelsPredicted : boolean;
    public BLASTRuns : boolean;
    public dateRan : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.alias = true;
        this.fullName = false;
        this.sizeInBytes = false;
        this.formattedSize = true;
        this.aligner = true;
        this.reads = true;
        this.mates = true;
        this.overallAlignmentRate = true;
        this.minimumCoverage = false;
        this.minimumVariableFrequency = false;
        this.minimumAverageQuality = false;
        this.pValueThreshold = false;
        this.SNPsPredicted = true;
        this.indelsPredicted = true;
        this.dateRan = false;
        this.SNPPositions = false;
        this.BLASTRuns = true;
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

export class MappedReadsPerContigInfoSelection
{
    public refSeqName : boolean;
    public seqLength : boolean;
    public mappedReads : boolean;
    public unMappedReads : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.refSeqName = true;
        this.seqLength = true;
        this.mappedReads = true;
        this.unMappedReads = true;
    }
}

export class BLASTRunsInfoSelection
{
    public start : boolean;
    public stop : boolean;
    public readsBLASTed : boolean;
    public program : boolean;
    public ran : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.start = true;
        this.stop = true;
        this.readsBLASTed = true;
        this.program = true;
        this.ran = false;
    }
}

export class BLASTSingleRunInfoSelection
{
    public position : boolean;
    public seq : boolean;
    public Hit_def : boolean;
    public eValue : boolean;
    [index : string] : boolean;
    public constructor()
    {
        this.position = true;
        this.seq = true;
        this.Hit_def = true;
        this.eValue = true;
    }
}

export class View extends viewMgr.View
{
    @Mangle
    public fastQInfoSelection : FastQInfoSelection;

    @Mangle
    public refSeqInfoSelection : FastaInfoSelection;

    @Mangle
    public alignmentInfoSelection : AlignmentInfoSelection;

    @Mangle
    public snpPositionsInfoSelection : SNPPositionsInfoSelection;

    @Mangle
    public mapppedReadsPerContigInfoSelection : MappedReadsPerContigInfoSelection;

    @Mangle
    public BLASTRunsInfoSelection : BLASTRunsInfoSelection;

    @Mangle
    public BLASTSingleRunInfoSelection : BLASTSingleRunInfoSelection;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.fastQInfoSelection = new FastQInfoSelection();
        this.refSeqInfoSelection = new FastaInfoSelection();
        this.alignmentInfoSelection = new AlignmentInfoSelection();
        this.snpPositionsInfoSelection = new SNPPositionsInfoSelection();
        this.mapppedReadsPerContigInfoSelection = new MappedReadsPerContigInfoSelection();
        this.BLASTRunsInfoSelection = new BLASTRunsInfoSelection();
        this.BLASTSingleRunInfoSelection = new BLASTSingleRunInfoSelection();
    }

    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
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
                        <input type="checkbox" id="aligner">Aligner</input>
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

                        <input type="checkbox" id="BLASTRuns">BLAST Runs</input>
                        <br />

                        <input type="checkbox" id="dateRan">Date Ran</input>
                        <br />
                    `;
                }

                if(masterView.displayInfo == "BLASTRuns")
                {
                    res += `
                        <input type="checkbox" id="start">Start</input>
                        <br />

                        <input type="checkbox" id="stop">Stop</input>
                        <br />

                        <input type="checkbox" id="readsBLASTed">Reads Blasted</input>
                        <br />

                        <input type="checkbox" id="program">Program</input>
                        <br />

                        <input type="checkbox" id="ran">Date Ran</input>
                        <br />
                    `;
                }

                if(masterView.displayInfo == "BLASTSingleRun")
                {
                    res += `
                        <input type="checkbox" id="position">Position</input>
                        <br />

                        <input type="checkbox" id="seq">Sequence</input>
                        <br />

                        <input type="checkbox" id="Hit_def">Hit Name</input>
                        <br />

                        <input type="checkbox" id="eValue">E-Value</input>
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
                                if(masterView.inspectingAlignUUID == masterView.alignData[i].uuid)
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
                if(masterView.displayInfo == "MappedReadsPerContigInfo")
                {
                    res += `
                        <input type="checkbox" id="refSeqName">Contig Name</input>
                        <br />

                        <input type="checkbox" id="seqLength">Length</input>
                        <br />

                        <input type="checkbox" id="mappedReads">Mapped Reads</input>
                        <br />

                        <input type="checkbox" id="unMappedReads">Unmapped Reads</input>
                        <br />
                    `;
                    let found = false;
                    for(let i = 0; i != masterView.alignData.length; ++i)
                    {
                        if(masterView.inspectingAlignUUID == masterView.alignData[i].uuid)
                        {
                            res += `
                                <h5>Mapped reads per contig for ${masterView.alignData[i].alias}</h5>
                            `;
                            found = true;
                            break;
                        }
                    }
                    if(!found)
                        throw new Error("No alignment to inspect");
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
            if(masterView.displayInfo == "MappedReadsPerContigInfo")
            {
                for(let i in this.mapppedReadsPerContigInfoSelection)
                {
                    if(this.mapppedReadsPerContigInfoSelection.hasOwnProperty(i))
                    {
                        try
                        {
                            (<HTMLInputElement>document.getElementById(i)).checked = this.mapppedReadsPerContigInfoSelection[i];
                        }
                        catch(err){}
                    }
                }
            }
            if(masterView.displayInfo == "BLASTRuns")
            {
                for(let i in this.BLASTRunsInfoSelection)
                {
                    if(this.BLASTRunsInfoSelection.hasOwnProperty(i))
                    {
                        try
                        {
                            (<HTMLInputElement>document.getElementById(i)).checked = this.BLASTRunsInfoSelection[i];
                        }
                        catch(err){console.log(err)}
                    }
                }
            }
            if(masterView.displayInfo == "BLASTSingleRun")
            {
                for(let i in this.BLASTSingleRunInfoSelection)
                {
                    if(this.BLASTSingleRunInfoSelection.hasOwnProperty(i))
                    {
                        try
                        {
                            (<HTMLInputElement>document.getElementById(i)).checked = this.BLASTSingleRunInfoSelection[i];
                        }
                        catch(err){console.log(err)}
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
        if(event.target.id == "exportReport")
        {   
            let reportView = <reportView.View>viewMgr.getViewByName("reportView",masterView.views);

            if((<HTMLInputElement>document.getElementById("XLSExport")).checked)
            {
                XLSExportDialog(reportView.renderView());
            }

            if((<HTMLInputElement>document.getElementById("CSVExport")).checked)
            {
                CSVExportDialog(reportView.renderView());
            }

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
            else if(masterView.displayInfo == "MappedReadsPerContigInfo")
            {
                this.mapppedReadsPerContigInfoSelection[event.target.id] = checked;
                viewMgr.render();
                return;
            }
            else if(masterView.displayInfo == "BLASTRuns")
            {
                this.BLASTRunsInfoSelection[event.target.id] = checked;
                viewMgr.render();
                return;
            }
            else if(masterView.displayInfo == "BLASTSingleRun")
            {
                this.BLASTSingleRunInfoSelection[event.target.id] = checked;
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