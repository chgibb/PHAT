
export interface varScanMPileup2SNPReport
{
    minCoverage : number;
    minVarFreq : number;
    minAvgQual : number;
    pValueThresh : number;
    SNPsReported : number;
    indelsReported : number;
}

export function varScanMPileup2SNPReportParser(report : string) : varScanMPileup2SNPReport
{
    let res : varScanMPileup2SNPReport = {
        minCoverage : 0,
        minVarFreq : 0,
        minAvgQual : 0,
        pValueThresh : 0,
        SNPsReported : 0,
        indelsReported : 0
    };

    let isMinCoverage = /(Min coverage:)/;
    let isMinVarFreq = /(Min var freq:)/;
    let isMinAvgQual = /(Min avg qual:)/;
    let isPValueThresh = /(P-value thresh:)/;
    let isVariantPositionsReported = /(variant positions reported)/;

    let lines : Array<string> = report.split(/\n/);

    for(let i : number = 0; i != lines.length; ++i)
    {
        let tokens : Array<string>;

        //Min coverage:	8
        if(isMinCoverage.test(lines[i]))
        {
            tokens = lines[i].split(/\s/);
            res.minCoverage = parseInt(tokens[2]);
            continue;
        }
        //Min var freq:	0.2
        if(isMinVarFreq.test(lines[i]))
        {
            tokens = lines[i].split(/\s/);
            console.log("minvarfreq");
            console.log(tokens);
            res.minVarFreq = parseFloat(tokens[3]);
            continue;
        }
        //Min avg qual:	15
        if(isMinAvgQual.test(lines[i]))
        {
            tokens = lines[i].split(/\s/);
            console.log("minavgqual");
            console.log(tokens);
            res.minAvgQual = parseInt(tokens[3]);
            continue;
        }
        //P-value thresh:	0.01
        if(isPValueThresh.test(lines[i]))
        {
            tokens = lines[i].split(/\s/);
            console.log("pvaluethresh");
            console.log(tokens);
            res.pValueThresh = parseFloat(tokens[2]);
            continue;
        }
        //8 variant positions reported (8 SNP, 0 indel)
        if(isVariantPositionsReported.test(lines[i]))
        {
            tokens = lines[i].split(/\s/);
            for(let k : number = 0; k != tokens.length; ++k)
            {
                if(tokens[k].charAt(0) == "(")
                {
                    res.SNPsReported = parseInt(tokens[k].substring(1));
                }
                else if(tokens[k].charAt(tokens[k].length-1) == ")")
                {
                    res.indelsReported = parseInt(tokens[k - 1]);
                }
            }
            continue;
        }
    }

    return res;

}