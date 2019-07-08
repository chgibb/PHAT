import * as React from "react";
import * as electron from "electron";

import {AlignData} from "../../alignData";
import {Table} from "../components/table";
import {sweepToBottom} from "../styles/sweepToBottom";
import {VCF2JSONRow} from "../../varScanMPileup2SNPVCF2JSON";
import {Fasta} from "../../fasta";
import {AtomicOperationIPC} from "../../atomicOperationsIPC";

import {TableCellHover} from "./tableCellHover";
import {SNPPositionsTable} from "./snpPositionsTable";
import {ReadsPerContigTable} from "./readsPerContigTable";

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

    public render(): JSX.Element 
    {
        return (
            <TableCellHover>
                <Table<AlignData>
                    toolbar={true}
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
                                        isSubTable={true}
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
                                        isSubTable={true}
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
                            field : "alias"
                        },
                        {
                            title: "Aligner",
                            render: (row: AlignData) => 
                            {
                                return row.alignerUsed;
                            },
                            searchable : true,
                            field : "alignerUsed"
                        },
                        {
                            title: "Size In Bytes",
                            render: (row: AlignData) => 
                            {
                                return row.size;
                            },
                            searchable : true,
                            field : "size"
                        },
                        {
                            title: "Formatted Size",
                            render: (row: AlignData) => 
                            {
                                return row.sizeString;
                            },
                            searchable : true,
                            field : "sizeString"
                        },
                        {
                            title: "Reads",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.reads : row.flagStatReport.reads;
                            },
                            searchable : true
                            ,
                            field : ""
                        },
                        {
                            title: "Mates",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.mates : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "Overall Alignment Rate %",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.overallAlignmentRate : row.flagStatReport.overallAlignmentRate;
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "Minimum Coverage",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minCoverage : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "Minimum Variable Frequency",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minVarFreq : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "Minimum Average Quality",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minAvgQual : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "P-Value Threshold",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.pValueThresh : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "SNPs Predicted",
                            cellStyle: sweepToBottom as any,
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? (<div id={this.SNPCellId(row)} className={TableCellHover.cellHoverClass}>{row.varScanSNPSummary.SNPsReported}</div>) : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "Indels Predicted",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.indelsReported : "Unknown";
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "BLAST Runs",
                            render: (row: AlignData) => 
                            {
                                return row.BLASTSegmentResults ? row.BLASTSegmentResults.length : 0;
                            },
                            searchable : true,
                            field : ""
                        },
                        {
                            title: "Date Ran",
                            render: (row: AlignData) => 
                            {
                                return row.dateStampString;
                            },
                            searchable : true,
                            field : "dateStampString"
                        },
                    ]}
                />
            </TableCellHover>
        );
    }
}