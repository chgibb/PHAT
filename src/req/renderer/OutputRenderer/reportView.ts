import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {getReadableAndWritable} from "./../../getAppPath";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as rightPanel from "./rightPanel";
import * as reportView from "./reportView";

import {VCF2JSONRow} from "./../../varScanMPileup2SNPVCF2JSON";
import {Fasta} from "./../../fasta";

import {renderQCReportTable} from "./reportView/renderQCReportTable";
import {renderAlignmentReportTable} from "./reportView/renderAlignmentReportTable";
import {renderSNPPositionsTable} from "./reportView/renderSNPPositionsTable";
import {renderMappedReadsPerContigTable} from "./reportView/renderMappedReadsPerContigTable";
import {renderBLASTRunsTable} from "./reportView/renderBLASTRunsTable";

import {getReadable} from "./../../getAppPath";

import {CSVExportDialog} from "./CSVExportDialog";
import {XLSExportDialog} from "./XLSExportDialog";


export class QCReportTableSortOptions
{
    public aliasAscending : boolean;
    public aliasDescending : boolean;
    public fullPathAscending : boolean;
    public fullPathDescending : boolean;
    public sizeInBytesAscending : boolean;
    public sizeInBytesDescending : boolean;
    public formattedSizeAscending : boolean;
    public formattedSizeDescending : boolean;
    public numberOfSequencesAscending : boolean;
    public numberofSequencesDescending : boolean;
    public perBaseSequenceQualityAscending : boolean;
    public perBaseSequenceQualityDescending : boolean;
    public perSequenceQualityScoreAscending : boolean;
    public perSequenceQualityScoreDescending : boolean;
    public perSequenceGCContentAscending : boolean;
    public perSequenceGCContentDescending : boolean;
    public sequenceDuplicationLevelsAscending : boolean;
    public sequenceDuplicationLevelsDescending : boolean;
    public overRepresentedSequencesAscending : boolean;
}

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
export class View extends viewMgr.View
{
    public inspectingUUID : string;
    public vcfRows : Array<VCF2JSONRow>;
    public constructor(div : string)
    {
        super("reportView",div);
        this.inspectingUUID = "";
        this.vcfRows = new Array<VCF2JSONRow>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        
        //if we're looking at SNP position, refresh table information if the alignment being inspected has changed
        if(masterView.displayInfo == "SNPPositions")
        {
            if(this.inspectingUUID != masterView.inspectingUUID)
            {
                this.vcfRows = JSON.parse(
                            fs.readFileSync(getReadableAndWritable(`rt/AlignmentArtifacts/${masterView.inspectingUUID}/snps.json`)
                    ).toString()
                );
                this.inspectingUUID = masterView.inspectingUUID;
            }
        }
        return `
            <img class="activeHover activeHoverButton" id="viewQC" src="${masterView.displayInfo == "QCInfo" ? getReadable("img/fastqButtonActive.png") : getReadable("img/fastqButton.png")}">
            <img class="activeHover activeHoverButton" id="viewAlign" src="${masterView.displayInfo == "AlignmentInfo" ? getReadable("img/alignButtonActive.png") : getReadable("img/alignButton.png")}">
            ${renderQCReportTable()}
            ${renderAlignmentReportTable()}
            ${renderSNPPositionsTable(this.vcfRows)}
            ${renderMappedReadsPerContigTable()}
            ${renderBLASTRunsTable()}
            <br/><button id="exportXLS">Export Excel</button>
            <br/><button id="exportCSV">Export CSV</button>
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.classList.contains("propogateParent"))
            event.target = event.target.parentElement;
        if(!event.target.id)
            return;
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);

        for(let i = 0; i != masterView.alignData.length; ++i)
        {
            if(masterView.alignData[i].BLASTSegmentResults)
            {
                for(let k = 0; k != masterView.alignData[i].BLASTSegmentResults.length; ++k)
                {
                    if(event.target.id == masterView.alignData[i].BLASTSegmentResults[k].uuid+"ViewReads")
                    {
                        alert("clicked");
                    }
                }
            }
            if(event.target.id == masterView.alignData[i].uuid+"ViewBLASTRuns")
            {
                masterView.inspectingUUID = masterView.alignData[i].uuid;
                masterView.displayInfo = "BLASTRuns";
                viewMgr.render();
                return;
            }

            if(event.target.id == masterView.alignData[i].uuid+"ViewSNPs")
            {
                masterView.inspectingUUID = masterView.alignData[i].uuid;
                masterView.displayInfo = "SNPPositions";
                viewMgr.render();
                return;
            }
            if(event.target.id == masterView.alignData[i].uuid+"ViewAlignment")
            {
                if(
                    masterView.alignData[i].isExternalAlignment ?
                    (masterView.alignData[i].flagStatReport && !masterView.alignData[i].flagStatReport.overallAlignmentRate):
                    (masterView.alignData[i].summary && !masterView.alignData[i].summary.overallAlignmentRate) 
                    
                )
                {
                    alert(`Can't view an alignment with 0% alignment rate`);
                    return;
                }
                let fasta : Fasta;
                //the fasta property of AlignData is not updated when the original fasta object is modified
                //find the original and see if it has been prepared for visualization, otherwise the pileup viewer
                //will not be able to visualize the alignment
                for(let k = 0; k != masterView.fastaInputs.length; ++k)
                {
                    
                    if(masterView.alignData[i].fasta && masterView.fastaInputs[k].uuid == masterView.alignData[i].fasta.uuid)
                    {
                        fasta = masterView.fastaInputs[k];
                        break;
                    }
                }
                if(!fasta)
                {
                    alert(`You must link this alignment to a reference to visualize`);
                    return;
                }
                if(!fasta.indexedForVisualization)
                {
                    alert(`The reference for this alignment is not ready for visualization`);
                    return;
                }
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "openPileupViewer",
                        pileupViewerParams : {
                            align : masterView.alignData[i],
                            contig : fasta.contigs[0].name.split(' ')[0],
                            start : 0,
                            stop : 100
                        }
                    }
                );
            }
            if(event.target.id == masterView.alignData[i].uuid+"AlignmentRate")
            {
                if(
                    masterView.alignData[i].isExternalAlignment ?
                    (masterView.alignData[i].flagStatReport && !masterView.alignData[i].flagStatReport.overallAlignmentRate):
                    (masterView.alignData[i].summary && !masterView.alignData[i].summary.overallAlignmentRate) 
                    
                )
                {
                    alert(`Can't view an alignment with 0% alignment rate`);
                    return;
                }
                masterView.inspectingUUID = masterView.alignData[i].uuid;
                masterView.displayInfo = "MappedReadsPerContigInfo";
                viewMgr.render();
                return;
            }
            if(masterView.alignData[i].uuid == masterView.inspectingUUID)
            {
                for(let k = 0; k != this.vcfRows.length; ++k)
                {
                    if(event.target.id == `viewSNP${k}`)
                    {
                        let fasta : Fasta;
                        for(let j = 0; j != masterView.fastaInputs.length; ++j)
                        {
                            if(masterView.fastaInputs[j].uuid == masterView.alignData[i].fasta.uuid)
                            {
                                fasta = masterView.fastaInputs[j];
                                break;
                            }
                        }
                        if(!fasta)
                        {
                            alert(`You must link this alignment to a reference to visualize`);
                            return;
                        }
                        if(!fasta.indexedForVisualization)
                        {
                            alert(`The reference for this alignment is not ready for visualization`);
                            return;
                        }
                        //trim off leading text
                        let snpPos = parseInt(event.target.id.replace(/(viewSNP)/,""));
                        //set beginning position in viewer offset by 20
                        let start = parseInt(this.vcfRows[snpPos].position)-20;
                        //offset end by 40 to center SNP in viewer
                        let stop = start+40;
                        let contig = this.vcfRows[snpPos].chrom;
                        ipc.send(
                            "runOperation",
                            <AtomicOperationIPC>{
                                opName : "openPileupViewer",
                                pileupViewerParams : {
                                    align : masterView.alignData[i],
                                    contig : contig,
                                    start : start,
                                    stop : stop
                                }
                            }
                        );
                        return;
                    }
                }
            }
        }
        if(event.target.id == "goBackToAlignments")
        {
            masterView.displayInfo = "AlignmentInfo";
            viewMgr.render();
            return;
        }

        if(event.target.id == "viewQC"){
            masterView.displayInfo = "QCInfo";
            viewMgr.render();
            return;
        }
        if(event.target.id == "viewAlign"){
            masterView.displayInfo = "AlignmentInfo";
            viewMgr.render();
            return;
        }

        if(event.target.id == "exportXLS")
        {   
            let reportView = <reportView.View>viewMgr.getViewByName("reportView",masterView.views);
            XLSExportDialog(reportView.renderView());
            return;
        }
        if (event.target.id == "exportCSV"){
            let reportView = <reportView.View>viewMgr.getViewByName("reportView",masterView.views);
            CSVExportDialog(reportView.renderView());
            return;
        }

    }
}
