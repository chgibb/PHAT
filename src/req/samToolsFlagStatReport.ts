export interface SamToolsFlagStatReport
{
    overallAlignmentRate : number;
}

export function samToolsFlagStatReportParser(report : string) : SamToolsFlagStatReport
{
    let res : SamToolsFlagStatReport = <any>{};

    let lines : Array<string> = report.split(/\n/);

    for(let i = 0; i != lines.length; ++i)
    {
        if(/mapped/.test(lines[i]))
        {
            let percentages = /(\d\d\.\d\d%)/.exec(lines[i]);
            if(percentages)
            {
                res.overallAlignmentRate = parseFloat(percentages[0].substr(0,percentages[0].length-1));
            }
        }
    }

    return res;
}