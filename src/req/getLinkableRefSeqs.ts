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
 * Determine the linkability of a list of contigs with an idxstats result
 * 
 * @export
 * @param {Array<Contig>} contigs 
 * @param {Array<SamToolsIdxStatsReport>} idxStatsReport 
 * @returns {CompareStatus} 
 */
export function compareContigsToIdxStatReport(contigs : Array<Contig>,idxStatsReport : Array<SamToolsIdxStatsReport>) : CompareStatus
{
    let res = new CompareStatus();

    let missing = new Array<string>();

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
            missing.push(contigs[i].name);
        }
    }
    if(missing.length > 0)
    {
        res.linkable = false;
        res.longReason = `The following contigs are missing:${"\n"}`;
        for(let i = 0; i != missing.length; ++ i)
        {
            res.longReason += `${missing[i]}${"\n"}`;
        }
        return res;
    }
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
        
        let status = compareContigsToIdxStatReport(fasta.contigs,align.idxStatsReport);

        if(status.linkable)
            curr.linkable = true;
        else
        {
            curr.linkable = false;
            curr.reason = "Missing Contigs";
            curr.longReason = status.longReason;
        }
        res.push(curr);
    }

    return res;
}