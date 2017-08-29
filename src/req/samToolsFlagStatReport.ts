export interface SamToolsFlagStatReport
{
    overallAlignmentRate : number;
    reads : number;
}

export function samToolsFlagStatReportParser(report : string) : SamToolsFlagStatReport
{
    let res : SamToolsFlagStatReport = <any>{};

    let lines : Array<string> = report.split(/\n/);

    for(let i = 0; i != lines.length; ++i)
    {
        if(i == 0)
        {
            let tokens : Array<string> = lines[i].split(/\s/);
            res.reads = parseInt(tokens[0]) + parseInt(tokens[2]);
        }
        if(/mapped/.test(lines[i]))
        {
            let percentages = /(\d\d\d\.\d\d%)|(\d\d.\d\d%)|(\d.\d\d%)/.exec(lines[i]);
            if(percentages)
            {
                let trimmed = percentages[0].substr(0,percentages[0].length - 1);
                res.overallAlignmentRate = parseFloat(trimmed);
            }
        }
    }

    return res;
}