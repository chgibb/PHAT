import * as React from "react";
import * as electron from "electron";

import {AlignData} from "../../../alignData";
import {Table} from "../../components/table";
import {sweepToBottom} from "../../styles/sweepToBottom";
import {VCF2JSONRow} from "../../../varScanMPileup2SNPVCF2JSON";
import {Fasta} from "../../../fasta";
import {AtomicOperationIPC} from "../../../atomicOperationsIPC";
import {TableCellHover} from "../tableCellHover";

import {SNPPositionsTable} from "./snpPositionsTable";
import {ReadsPerContigTable} from "./readsPerContigTable";
import {BLASTRunsTable} from "./BLASTRunsTable";

const ipc = electron.ipcRenderer;

export interface AlignmentsReportTableProps 
{
    aligns?: Array<AlignData>;
    fastas?: Array<Fasta>;
}

export class AlignmentsReportTable extends React.Component<AlignmentsReportTableProps, {}>
{
    public constructor(props: AlignmentsReportTableProps) 
    {
        super(props);
    }

    public SNPCellId(row: AlignData): string 
    {
        return `${row.uuid}SNP`;
    }

    public aliasCellId(row: AlignData): string 
    {
        return `${row.uuid}ViewAlignment`;
    }

    public BLASTRunsCellId(row : AlignData) : string
    {
        return `${row.uuid}ViewBLASTRuns`;
    }

    public render(): JSX.Element 
    {
        return (
            <TableCellHover>
                <Table<AlignData>
                    title="Alignment Reports"
                    data={this.props.aligns}
                    detailPanel={[
                        {
                            tooltip: "SNPs",
                            render: (rowData: AlignData) => 
                            {
                                return (
                                    <SNPPositionsTable
                                        align={rowData}
                                        fastas={this.props.fastas}
                                        subTableProps={{
                                            isSubTable : true,
                                            nesting : 1
                                        }}
                                    />
                                );
                            }
                        },
                        {
                            tooltip: "Reads Aligned Per Contig",
                            render: (rowData : AlignData) => 
                            {
                                return (
                                    <ReadsPerContigTable
                                        align={rowData}
                                        subTableProps={{
                                            isSubTable : true,
                                            nesting : 1
                                        }}
                                    />
                                );
                            }
                        },
                        {
                            tooltip : "BLAST Runs",
                            render : (rowData : AlignData) => 
                            {
                                return (
                                    <BLASTRunsTable
                                        align={rowData}
                                        subTableProps={{
                                            isSubTable : true,
                                            nesting : 1
                                        }}
                                    />
                                );
                            }
                        }
                    ]}
                    onRowClick={(event: React.MouseEvent<HTMLElement>, rowData: AlignData, toggleDetailPanel) => 
                    {
                        let el = TableCellHover.getClickedCell(event);

                        if (el) 
                        {
                            if (this.SNPCellId(rowData) == el.id) 
                            {
                                toggleDetailPanel(0);
                            }

                            else if (this.aliasCellId(rowData) == el.id) 
                            {
                                if (
                                    rowData.isExternalAlignment ?
                                        (rowData.flagStatReport && !rowData.flagStatReport.overallAlignmentRate) :
                                        (rowData.summary && !rowData.summary.overallAlignmentRate)

                                ) 
                                {
                                    alert("Can't view an alignment with 0% alignment rate");
                                    return;
                                }

                                let fasta: Fasta | undefined;
                                
                                for (let k = 0; k != this.props.fastas.length; ++k) 
                                {

                                    if (rowData.fasta && this.props.fastas[k].uuid == rowData.fasta.uuid) 
                                    {
                                        fasta = this.props.fastas[k];
                                        break;
                                    }
                                }
                                if (!fasta) 
                                {
                                    alert("You must link this alignment to a reference to visualize");
                                    return;
                                }
                                if (!fasta.indexedForVisualization) 
                                {
                                    alert("The reference for this alignment is not ready for visualization");
                                    return;
                                }
                                ipc.send(
                                    "runOperation",
                                    {
                                        opName: "openPileupViewer",
                                        pileupViewerParams: {
                                            align: rowData,
                                            contig: fasta.contigs[0].name.split(" ")[0],
                                            start: 0,
                                            stop: 100
                                        }
                                    } as AtomicOperationIPC
                                );
                            }

                            else if(this.BLASTRunsCellId(rowData) == el.id)
                            {
                                toggleDetailPanel(2);
                            }
                        }
                    }}
                    columns={[
                        {
                            title: "Alias",
                            render: (row: AlignData) => 
                            {
                                return (<div id={this.aliasCellId(row)} className={TableCellHover.cellHoverClass}>{row.alias}</div>);
                            },
                            searchable : true,
                            field : "alias",
                            hidden : false
                        },
                        {
                            title: "Aligner",
                            render: (row: AlignData) => 
                            {
                                return row.alignerUsed;
                            },
                            searchable : true,
                            field : "alignerUsed",
                            hidden : false
                        },
                        {
                            title: "Size In Bytes",
                            render: (row: AlignData) => 
                            {
                                return row.size;
                            },
                            searchable : true,
                            field : "size",
                            hidden : true
                        },
                        {
                            title: "Formatted Size",
                            render: (row: AlignData) => 
                            {
                                return row.sizeString;
                            },
                            searchable : true,
                            field : "sizeString",
                            hidden : false
                        },
                        {
                            title: "Reads",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.reads : row.flagStatReport.reads;
                            },
                            searchable : true
                            ,
                            field : "",
                            hidden : false
                        },
                        {
                            title: "Mates",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.mates : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : false
                        },
                        {
                            title: "Overall Alignment Rate %",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.overallAlignmentRate : row.flagStatReport.overallAlignmentRate;
                            },
                            searchable : true,
                            field : "",
                            hidden : false
                        },
                        {
                            title: "Minimum Coverage",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minCoverage : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : true
                        },
                        {
                            title: "Minimum Variable Frequency",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minVarFreq : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : true
                        },
                        {
                            title: "Minimum Average Quality",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minAvgQual : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : true
                        },
                        {
                            title: "P-Value Threshold",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.pValueThresh : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : true
                        },
                        {
                            title: "SNPs Predicted",
                            cellStyle: sweepToBottom as any,
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? (<div id={this.SNPCellId(row)} className={TableCellHover.cellHoverClass}>{row.varScanSNPSummary.SNPsReported}</div>) : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : false
                        },
                        {
                            title: "Indels Predicted",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.indelsReported : "Unknown";
                            },
                            searchable : true,
                            field : "",
                            hidden : true
                        },
                        {
                            title: "BLAST Runs",
                            render: (row: AlignData) => 
                            {
                                return row.BLASTSegmentResults ? (<div id={this.BLASTRunsCellId(row)} className={TableCellHover.cellHoverClass}>{row.BLASTSegmentResults.length}</div>) : 0;
                            },
                            searchable : true,
                            field : "",
                            hidden : false
                        },
                        {
                            title: "Date Ran",
                            render: (row: AlignData) => 
                            {
                                return row.dateStampString;
                            },
                            searchable : true,
                            field : "dateStampString",
                            hidden : true
                        },
                    ]}
                />
            </TableCellHover>
        );
    }
}