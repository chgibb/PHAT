import * as fs from "fs";

import * as electron from "electron";
import * as React from "react";

import {AlignData, getSNPsJSON} from "../../../alignData";
import {VCF2JSONRow} from "../../../varScanMPileup2SNPVCF2JSON";
import {Table} from "../../components/table";
import {Fasta} from "../../../fasta";
import {AtomicOperationIPC} from "../../../atomicOperationsIPC";
import {TableCellHover} from "../tableCellHover";

const ipc = electron.ipcRenderer;

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

    return (
        <TableCellHover>
            <Table<VCF2JSONRow>
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

                        //trim off leading text
                        let snpPos = parseInt(el.id.replace(/(viewSNP)/,""));
                        //set beginning position in viewer offset by 20
                        let start = parseInt(snps[snpPos].position)-20;
                        //offset end by 40 to center SNP in viewer
                        let stop = start+40;
                        let contig = snps[snpPos].chrom;
                        ipc.send(
                            "runOperation",
                            {
                                opName : "openPileupViewer",
                                pileupViewerParams : {
                                    align : props.align,
                                    contig : contig,
                                    start : start,
                                    stop : stop
                                }
                            } as AtomicOperationIPC
                        );
                    }
                }}
                columns={[
                    {
                        title : "Chrom",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.chrom;
                        },
                        searchable : true,
                        field : "chrom",
                        hidden : false
                    },
                    {
                        title : "Position",
                        render : (row) => 
                        {
                            console.log(row);

                            return (<div id={`viewSNP${row.tableData.id}`} className={TableCellHover.cellHoverClass}>{row.position}</div>);
                        },
                        searchable : true,
                        field : "position",
                        hidden : false
                    },
                    {
                        title : "Ref",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.ref;
                        },
                        searchable : true,
                        field : "ref",
                        hidden : false
                    },
                    {
                        title : "Var",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.var;
                        },
                        searchable : true,
                        field : "var",
                        hidden : false
                    },
                    {
                        title : "Cons:Cov:Reads1:Reads2:Freq:P-value",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.consCovReads1Reads2FreqPValue;
                        },  
                        searchable : true,
                        field : "consCovReads1Reads2FreqPValue",
                        hidden : true
                    },
                    {
                        title : "StrandFilter:R1+:R1-:R2+:R2-:pval",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.strandFilterR1R1R2R2pVal;
                        },
                        searchable : true,
                        field : "strandFilterR1R1R2R2pVal",
                        hidden : true
                    },
                    {
                        title : "SamplesRef",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesRef;
                        },
                        searchable : true,
                        field : "samplesRef",
                        hidden : true

                    },
                    {
                        title : "SamplesHet",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesHet;
                        },
                        searchable : true,
                        field : "samplesHet",
                        hidden : true
                    },
                    {
                        title : "SamplesHom",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesHom;
                        },
                        searchable : true,
                        field : "samplesHom",
                        hidden : true
                    },
                    {
                        title : "SamplesNC",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.samplesNC;
                        },
                        searchable : true,
                        field : "samplesNC",
                        hidden : true
                    },
                    {
                        title : "Cons:Cov:Reads1:Reads2:Freq:P-value",
                        render : (row : VCF2JSONRow) => 
                        {
                            return row.consCovReads1Reads2FreqPValue2;
                        },
                        searchable : true,
                        field : "consCovReads1Reads2FreqPValue2",
                        hidden : true
                    },
                ]}
            />
        </TableCellHover>
    );
}