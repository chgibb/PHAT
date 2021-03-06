import * as fs from "fs";

import * as React from "react";

import {AlignData, getSNPsJSON} from "../../../alignData";
import {VCF2JSONRow} from "../../../varScanMPileup2SNPVCF2JSON";
import {Table} from "../../components/table";
import {Fasta} from "../../../fasta";
import {TableCellHover} from "../tableCellHover";
import {enQueueOperation} from "../../enQueueOperation";
import {GridWrapper} from "../gridWrapper";
import {Grid} from "../../components/grid";
import {RefToVarSNPsDoughnut} from "../charts/refToVarSNPsDoughnut";


export interface SNPPositionsTableProps
{
    align? : AlignData;
    fastas : Array<Fasta>;
}

/**
 * Table of SNP positions
 *
 * @export
 * @param {SNPPositionsTableProps} props - Component properties
 * @returns {JSX.Element}
 */
export function SNPPositionsTable(props : SNPPositionsTableProps) : JSX.Element
{
    let snps : Array<VCF2JSONRow> | undefined;

    try
    {
        snps = JSON.parse(fs.readFileSync(getSNPsJSON(props.align!)).toString());
    }
    catch(err)
    {
        console.log(err);
    }

    return (
        <React.Fragment>
            {snps && snps.length > 0 ?
                <GridWrapper>
                    <Grid container spacing={1} justify="center">
                        <RefToVarSNPsDoughnut
                            snps={snps}
                            height="50%"
                            width="50%"
                            marginBottom="15vh"
                        />
                    </Grid>
                </GridWrapper> : ""}
            <TableCellHover>
                <Table<VCF2JSONRow>
                    title=""
                    data={snps ? snps : []}
                    onRowClick={(event? : React.MouseEvent,rowData?) => 
                    {
                        if(!event)
                            return;

                        console.log(rowData);
                    
                        let el = TableCellHover.getClickedCell(event);

                        if(el)
                        {
                            let fasta : Fasta | undefined;

                            for(let i = 0; i != props.fastas.length; ++i)
                            {
                                if(props.fastas[i].uuid == props.align!.fasta!.uuid)
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
                            let start = parseInt(snps![snpPos].position)-20;
                            //offset end by 40 to center SNP in viewer
                            let stop = start+40;
                            let contig = snps![snpPos].chrom;
                        
                            enQueueOperation({
                                opName : "openPileupViewer",
                   
                                align : props.align!,
                                contig : contig,
                                start : start,
                                stop : stop
                            
                            });
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
        </React.Fragment>
    );
}