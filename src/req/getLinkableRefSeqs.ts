import {Fasta} from "./fasta";
import {Contig} from "./fastaContigLoader";
import {AlignData} from "./alignData";
import {SamToolsIdxStatsReport} from "./samToolsIdxStatsReport";

/**
 * Structure describing the linkability of a ref seq. If linkable is false, reason will give a short description, longReason
 * will describe in greater detail the causes for the ref seqs unsuitability
 * 
 * @export
 * @interface LinkableRefSeq
 */
export class LinkableRefSeq
{
    public uuid : string;
    public linkable : boolean;
    public reason : string;
    public longReason : string;
    constructor()
    {
        this.linkable = false;
        this.reason = "";
        this.longReason = "";
    }
}

/**
 * Structure describing the result of a linkability test. longReason will contain linkability errors on failure
 * 
 * @export
 * @class CompareStatus
 */
export class CompareStatus
{
    public linkable : boolean;
    public longReason : string;
    constructor()
    {
        this.linkable = false;
        this.longReason = "";
    }
}

/**
 * Determine the linkability of a list of contigs with an idxstats result by looking for contigs which exist in contigs
 * but are not present in idxStatsReport
 * 
 * @export
 * @param {Array<Contig>} contigs 
 * @param {Array<SamToolsIdxStatsReport>} idxStatsReport 
 * @returns {CompareStatus} 
 */
export function compareContigsToIdxStatReportExtra(contigs : Array<Contig>,idxStatsReport : Array<SamToolsIdxStatsReport>) : CompareStatus
{
    let res = new CompareStatus();

    let extra = new Array<string>();

    if(!contigs || contigs.length == 0)
        throw new Error("contigs must have length > 0");

    for(let i = 0; i != contigs.length; ++i)
    {
        let found = false;
        for(let k = 0; k != idxStatsReport.length; ++k)
        {
            if(contigs[i].name.split(/\s/)[0] == idxStatsReport[k].refSeqName)
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            extra.push(contigs[i].name);
        }
    }
    if(extra.length > 0)
    {
        res.linkable = false;
        res.longReason += `The following contigs are present in the reference, not in the alignment map:${"\n"}`;
        for(let i = 0; i != extra.length; ++i)
        {
            res.longReason += `${extra[i]}${"\n"}`;
        }
    }
    if(res.longReason != "")
        return res;
    res.linkable = true;
    return res;
}

/**
 * Determine the linkability of a list of contigs with an idxstats result by looking for contigs which exist in idxStatsReport
 * but are not present in contigs
 * 
 * @export
 * @param {Array<Contig>} contigs 
 * @param {Array<SamToolsIdxStatsReport>} idxStatsReport 
 * @returns {CompareStatus} 
 */
export function compareContigsToIdxStatReportMissing(contigs : Array<Contig>,idxStatsReport : Array<SamToolsIdxStatsReport>) : CompareStatus
{
    let res = new CompareStatus();

    let missing = new Array<string>();

    if(!contigs || contigs.length == 0)
        throw new Error("contigs must length > 0");

    for(let i = 0; i != idxStatsReport.length; ++i)
    {
        let found = false;
        if(idxStatsReport[i].refSeqName == "*" || idxStatsReport[i].refSeqName == "")
            continue;
        for(let k = 0; k != contigs.length; ++k)
        {
            if(idxStatsReport[i].refSeqName == contigs[k].name.split(/\s/)[0])
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            missing.push(idxStatsReport[i].refSeqName);
        }
    }
    if(missing.length > 0)
    {
        res.linkable = false;
        res.longReason += `The following contigs are present in the alignment map but not in the reference:${"\n"}`;
        for(let i = 0; i != missing.length; ++i)
        {
            res.longReason += `${missing[i]}${"\n"}`;
        }
    }
    if(res.longReason != "")
        return res;
    res.linkable = true;
    return res;
}

/**
 * Returns a list of reference sequences which are potential link candidates for the given alignment
 * 
 * @export
 * @param {Array<Fasta>} fastaInputs 
 * @param {AlignData} align 
 * @returns {Array<LinkableRefSeq>} 
 */
export function getLinkableRefSeqs(fastaInputs : Array<Fasta>,align : AlignData) : Array<LinkableRefSeq>
{
    let res = new Array<LinkableRefSeq>();

    for(let i = 0; i != fastaInputs.length; ++i)
    {
        let fasta = fastaInputs[i];
        let curr = new LinkableRefSeq();
        curr.uuid = fasta.uuid;
        
        if(fasta.contigs && fasta.contigs.length > 0)
        {
            let extraStatus = compareContigsToIdxStatReportExtra(fasta.contigs,align.idxStatsReport);
            let missingStatus = compareContigsToIdxStatReportMissing(fasta.contigs,align.idxStatsReport);

            if(extraStatus.linkable && missingStatus.linkable)
                curr.linkable = true;
            else
            {
                curr.linkable = false;
                if(!extraStatus.linkable)
                {
                    curr.reason = "Extra Contigs";
                    curr.longReason += extraStatus.longReason;
                }
                if(!missingStatus.linkable)
                {
                    curr.reason = "Missing Contigs";
                    curr.longReason += "\n";
                    curr.longReason += missingStatus.longReason;
                }

            }
            res.push(curr);
        }
        else
        {
            curr.linkable = false;
            curr.reason = "Not Indexed";
            curr.reason = "Ref is not indexed for visualization or indexing";
            res.push(curr);
        }
    }

    return res;
}