export interface Bowtie2Report
{
    reads : number;
    mates : number;
    overallAlignmentRate : number;
}
export function parseBowTie2AlignmentReport(report : string) : Bowtie2Report
{
    let res : Bowtie2Report;
    let tokens : Array<string>;

    //There's a bug in JobIPC's unbuffering of Bowtie2's output.
    //It picks up an undefined value at the beginning of the buffer which gets coerced to a string and 
    //prefixed to the text. Trim it off before we parse the report.
    //<hack>
    if(report.match(new RegExp("(undefined)","g")))
        report = report.substring(9,tokens.length);
    //</hack>
    tokens = report.split(new RegExp("[ ]|[\n]|[\t]"));
    
    for(let i = 0; i != tokens.length; i++)
    {
        if(tokens[i].match(new RegExp("(reads;)","g")))
        {
            res.reads = parseInt(tokens[i-1]);
        }
        if(tokens[i].match(new RegExp("(mates)","g")))
        {
            res.mates = parseInt(tokens[i-1]);
        }
        if(tokens[i].match(new RegExp("(overall)","g")))
        {
            res.overallAlignmentRate = parseFloat(tokens[i-1].substring(0,tokens[i-1].length-1));
        }
    }
    return res;
}