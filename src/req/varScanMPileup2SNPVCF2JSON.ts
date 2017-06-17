export interface VCF2JSONRow
{
    chrom : string;
    position : string;
    ref : string;
    var : string;
    consCovReads1Reads2FreqPValue : string;
    strandFilterR1R1R2R2pVal : string;
    samplesRef : string;
    samplesHet : string;
    samplesHom : string;
    samplesNC : string;
    consCovReads1Reads2FreqPValue2 : string;
}

export function varScanMPileup2SNPVCF2JSON(vcf : string) : Array<VCF2JSONRow>
{
    let res : Array<VCF2JSONRow> = new Array<VCF2JSONRow>();

    let lines = vcf.split(/\n/);
    console.log(lines);

    //skip header line at 0
    for(let i = 1; i != lines.length; ++i)
    {
        let tokens = lines[i].split(/\s/);
        res.push(<VCF2JSONRow>{
            chrom : tokens[0],
            position : tokens[1],
            ref : tokens[2],
            var : tokens[3],
            consCovReads1Reads2FreqPValue : tokens[4],
            strandFilterR1R1R2R2pVal : tokens[5],
            samplesRef : tokens[6],
            samplesHet : tokens[7],
            samplesHom : tokens[8],
            samplesNC : tokens[9],
            consCovReads1Reads2FreqPValue2 : tokens[10]
        });
    }
    return res;
}