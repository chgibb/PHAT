import * as fs from "fs";

import * as React from "react";
import { AlignData, getSNPsJSON } from '../../alignData';
import { TableCellHover } from './tableCellHover';
import { VCF2JSONRow } from '../../varScanMPileup2SNPVCF2JSON';
import { Table } from '../components/table';

export interface SNPPositionsTableProps
{
    align : AlignData;
}

export function SNPPositionsTable(props : SNPPositionsTableProps) : JSX.Element
{
    let snps : Array<VCF2JSONRow> | undefined;

    try
    {
        snps = JSON.parse(fs.readFileSync(getSNPsJSON(props.align)).toString());
    }
    catch(err)
    {
        console.log(err);
    }

    console.log(snps);

    return (
        <TableCellHover>
            <Table<VCF2JSONRow>
                toolbar={false}
                title=""
                data={snps}
                columns={[
                    {
                        title : "Chrom",
                        render : (row : VCF2JSONRow) => {
                            return row.chrom;
                        }
                    },
                    {
                        title : "Position",
                        render : (row : VCF2JSONRow) => {
                            return row.position;
                        }
                    },
                    {
                        title : "Ref",
                        render : (row : VCF2JSONRow) => {
                            return row.ref;
                        }
                    },
                    {
                        title : "Var",
                        render : (row : VCF2JSONRow) => {
                            return row.var;
                        }
                    },
                    {
                        title : "Cons:Cov:Reads1:Reads2:Freq:P-value",
                        render : (row : VCF2JSONRow) => {
                            return row.consCovReads1Reads2FreqPValue
                        }
                    },
                    {
                        title : "StrandFilter:R1+:R1-:R2+:R2-:pval",
                        render : (row : VCF2JSONRow) => {
                            return row.strandFilterR1R1R2R2pVal;
                        }
                    },
                    {
                        title : "SamplesRef",
                        render : (row : VCF2JSONRow) => {
                            return row.samplesRef;
                        }
                    },
                    {
                        title : "SamplesHet",
                        render : (row : VCF2JSONRow) => {
                            return row.samplesHet;
                        }
                    },
                    {
                        title : "SamplesHom",
                        render : (row : VCF2JSONRow) => {
                            return row.samplesHom;
                        }
                    },
                    {
                        title : "SamplesNC",
                        render : (row : VCF2JSONRow) => {
                            return row.samplesNC;
                        }
                    },
                    {
                        title : "Cons:Cov:Reads1:Reads2:Freq:P-value",
                        render : (row : VCF2JSONRow) => {
                            return row.consCovReads1Reads2FreqPValue2
                        }
                    },
                ]}
            />
        </TableCellHover>
    );
}