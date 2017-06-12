export interface SamToolsIdxStatsReport
{
    refSeqName : string;
    seqLength : string;
    mappedReads : number;
    unMappedReads : number
}

export function samToolsIdxStatsReportParser(report : string) : Array<SamToolsIdxStatsReport>
{
    let res = new Array<SamToolsIdxStatsReport>();

    let lines : Array<string> = report.split(/\n/);

    for(let i : number = 0; i != lines.length; ++i)
    {
        let tokens = lines[i].split(/\s/);
        
        res.push(<SamToolsIdxStatsReport>{
            refSeqName : tokens[0],
            seqLength : tokens[1],
            mappedReads : parseInt(tokens[2]),
            unMappedReads : parseInt(tokens[3])
        });
    }
    return res;
}