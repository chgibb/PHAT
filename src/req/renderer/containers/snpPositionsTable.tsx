import * as fs from "fs";

import * as React from "react";

import {AlignData, getSNPsJSON} from "../../alignData";
import {VCF2JSONRow} from "../../varScanMPileup2SNPVCF2JSON";
import {Table} from "../components/table";
import {Fasta} from "../../fasta";

import {TableCellHover} from "./tableCellHover";

export interface SNPPositionsTableProps
{
    align : AlignData;
    fastas : Array<Fasta>;
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
                onRowClick={(event : React.MouseEvent<HTMLElement>,rowData) => 
                {
                    console.log(rowData);
                    
                    let el = TableCellHover.getClickedCell(event);

                    if(el)
                    {
                        let fasta : Fasta | undefined;

                        for(let i = 0; i != props.fastas.length; ++i)
                        {
                            if(props.fastas[i].uuid == props.align.fasta.uuid)
                            {
                                fasta = props.fastas[i];
                                break;
                            }
                        }

                        if(!fasta)
                        {
                            alert("You must link this alignment to a reference to visualize");
                            return;
                        }

                        if(!fasta.indexedForVisualization)
                        {
                            alert("The reference for this alignment is not ready for visualization");
                            return;
                        }
                    }
                }}
                columns={[
                    {
                        title : "Chrom",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.chrom;
                        }
                    },
                    {
                        title : "Position",
                        render : (row) => 
                        {
                            console.log(row);

                            return (<div id={`viewSNP${row.tableData.id}`} className={TableCellHover.cellHoverClass}>{row.position}</div>);
                        }
                    },
                    {
                        title : "Ref",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.ref;
                        }
                    },
                    {
                        title : "Var",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.var;
                        }
                    },
                    {
                        title : "Cons:Cov:Reads1:Reads2:Freq:P-value",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.consCovReads1Reads2FreqPValue;
                        }
                    },
                    {
                        title : "StrandFilter:R1+:R1-:R2+:R2-:pval",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.strandFilterR1R1R2R2pVal;
                        }
                    },
                    {
                        title : "SamplesRef",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesRef;
                        }
                    },
                    {
                        title : "SamplesHet",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesHet;
                        }
                    },
                    {
                        title : "SamplesHom",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesHom;
                        }
                    },
                    {
                        title : "SamplesNC",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesNC;
                        }
                    },
                    {
                        title : "Cons:Cov:Reads1:Reads2:Freq:P-value",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.consCovReads1Reads2FreqPValue2;
                        }
                    },
                ]}
            />
        </TableCellHover>
    );
}