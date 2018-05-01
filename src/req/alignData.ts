import * as dFormat from "./dateFormat";
import {getReadableAndWritable} from "./getAppPath";
import {Fastq} from "./fastq";
import {Fasta} from "./fasta";
import {Bowtie2Report} from "./bowTie2AlignmentReportParser";
import {varScanMPileup2SNPReport} from "./varScanMPileup2SNPReportParser";
import {SamToolsIdxStatsReport} from "./samToolsIdxStatsReport";
import {SamToolsFlagStatReport} from "./samToolsFlagStatReport";
export class AlignData
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
    public summary : Bowtie2Report;
    public summaryText : string;
    public varScanSNPSummary : varScanMPileup2SNPReport;
    public varScanSNPReport : string;
    public idxStatsReport : Array<SamToolsIdxStatsReport>;
    public flagStatReport : SamToolsFlagStatReport;
    public isExternalAlignment : boolean; 
    public constructor()
    {
        const uuidv4 : () => string = require("uuid/v4");
        
        this.fastqs = new Array();
        this.dateStampString = "";
        this.dateStamp = "";
        this.alias = "";
        this.invokeString = "";
        this.summaryText = "";
        this.dateStamp = dFormat.generateFixedSizeDateStamp();
        this.dateStampString = dFormat.formatDateStamp(this.dateStamp);
        this.uuid = uuidv4();
    }
}

export function getArtifactDir(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}`);
}
export function getCoverageDir(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/contigCoverage`)
}
export function getSam(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.sam`);
}
export function getUnSortedBam(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.bam`);
}
export function getSortedBam(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.sorted.bam`);
}
export function getSortBamIndex(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/out.sorted.bam.bai`);
}
export function getCoverage(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/depth.coverage`);
}
export function getCoverageForContig(alignData : AlignData,contigUUID : string) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/contigCoverage/${contigUUID}`);
}
export function getMPileup(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/pileup.mpileup`);
}
export function getSNPsVCF(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/snps.vcf`);
}
export function getSNPsJSON(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/snps.json`);
}
export function getIdxStats(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/idxstats`);
}
export function getFlagStats(alignData : AlignData) : string
{
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/flagstats`);
}