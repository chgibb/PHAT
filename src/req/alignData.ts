import * as dFormat from "./dateFormat";
import {getReadableAndWritable} from "./getAppPath";
import {Fastq} from "./fastq";
import {Fasta} from "./fasta";
import {Bowtie2Report} from "./bowTie2AlignmentReportParser";
import {varScanMPileup2SNPReport} from "./varScanMPileup2SNPReportParser";
import {SamToolsIdxStatsReport} from "./samToolsIdxStatsReport";
import {SamToolsFlagStatReport} from "./samToolsFlagStatReport";
import {BLASTSegmentResult} from "./BLASTSegmentResult";
import {UniquelyAddressable} from "./uniquelyAddressable";

export class AlignData implements UniquelyAddressable
{
    public uuid : string;
    public fastqs : Array<Fastq>;
    public size : number | undefined;
    public sizeString : string | undefined;
    public dateStampString : string;
    public dateStamp : string;
    public alias : string;
    public invokeString : string;
    public alignerUsed : string | undefined;
    public fasta : Fasta | undefined;
    public summary : Bowtie2Report | undefined;
    public summaryText : string;
    public varScanSNPSummary : varScanMPileup2SNPReport | undefined;
    public varScanSNPReport : string | undefined;
    public idxStatsReport : Array<SamToolsIdxStatsReport> | undefined;
    public flagStatReport : SamToolsFlagStatReport | undefined;
    public BLASTSegmentResults : Array<BLASTSegmentResult> | undefined;
    public isExternalAlignment : boolean | undefined; 
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
    return getReadableAndWritable(`rt/AlignmentArtifacts/${alignData.uuid}/contigCoverage`);
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