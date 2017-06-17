const uuidv4 : () => string = require("uuid/v4");

let dFormat = require('./dateFormat');
import {getReadableAndWritable} from "./getAppPath";
import Fastq from "./fastq";
import {Fasta} from "./fasta";
import {Bowtie2Report} from "./bowTie2AlignmentReportParser";
import {varScanMPileup2SNPReport} from "./varScanMPileup2SNPReportParser";
import {SamToolsIdxStatsReport} from "./samToolsIdxStatsReport";
export class alignData
{
    public uuid : string;
    public fastqs : Array<Fastq>;
    public size : number;
    public sizeString : string;
    public dateStampString : string;
    public dateStamp : string;
    public alias : string;
    public invokeString : string;
    public fasta : Fasta;
    public type : string;
    public summary : Bowtie2Report;
    public summaryText : string;
    public varScanSNPSummary : varScanMPileup2SNPReport;
    public varScanSNPReport : string;
    public idxStatsReport : Array<SamToolsIdxStatsReport>; 
    public constructor()
    {
        this.fastqs = new Array();
        this.dateStampString = "";
        this.dateStamp = "";
        this.alias = "";
        this.invokeString = "";
        this.type = "";
        this.summaryText = "";
        this.dateStamp = dFormat.generateFixedSizeDateStamp();
        this.dateStampString = dFormat.formatDateStamp(this.dateStamp);
        this.uuid = uuidv4();
    }
}

export function getArtifactDir(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}`);
}
export function getCoverageDir(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/contigCoverage`)
}
export function getSam(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.sam`);
}
export function getUnSortedBam(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.bam`);
}
export function getSortedBam(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.sorted.bam`);
}
export function getSortBamIndex(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.sorted.bam.bai`);
}
export function getCoverage(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/depth.coverage`);
}
export function getCoverageForContig(alignData : alignData,contigUUID : string) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/contigCoverage/${contigUUID}`);
}
export function getMPileup(alignData : alignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/pileup.mpileup`);
}