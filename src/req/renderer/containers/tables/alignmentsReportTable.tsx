import * as React from "react";
import * as electron from "electron";

import {AlignData} from "../../../alignData";
import {Table} from "../../components/table";
import {sweepToBottom} from "../../styles/sweepToBottom";
import {Fasta} from "../../../fasta";
import {AtomicOperationIPC} from "../../../atomicOperationsIPC";
import {TableCellHover} from "../tableCellHover";
import {Search} from "../../components/icons/search";

const ipc = electron.ipcRenderer;

export interface AlignmentsReportTableProps 
{
    aligns?: Array<AlignData>;
    fastas?: Array<Fasta>;
    onRowClick : (event: React.MouseEvent<HTMLElement>, rowData: AlignData) => void;
    viewMore : (rowData : AlignData) => void;
}

export class AlignmentsReportTable extends React.Component<AlignmentsReportTableProps, {}>
{
    public constructor(props: AlignmentsReportTableProps) 
    {
        super(props);
    }

    public static SNPCellId(row: AlignData): string 
    {
        return `${row.uuid}SNP`;
    }

    public static aliasCellId(row: AlignData): string 
    {
        return `${row.uuid}ViewAlignment`;
    }

    public static BLASTRunsCellId(row : AlignData) : string
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
                    onRowClick={(event,rowData) => 
                    {
                        this.props.onRowClick(event,rowData);
                    }}
                    columns={[
                        {
                            title: "Alias",
                            render: (row: AlignData) => 
                            {
                                return (<div id={AlignmentsReportTable.aliasCellId(row)} className={TableCellHover.cellHoverClass}>{row.alias}</div>);
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
                                return row.varScanSNPSummary ? (<div id={AlignmentsReportTable.SNPCellId(row)} className={TableCellHover.cellHoverClass}>{row.varScanSNPSummary.SNPsReported}</div>) : "Unknown";
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
                                return row.BLASTSegmentResults ? (<div id={AlignmentsReportTable.BLASTRunsCellId(row)} className={TableCellHover.cellHoverClass}>{row.BLASTSegmentResults.length}</div>) : 0;
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
                    actions={[
                        (row : AlignData) => ({
                            icon : Search as any,
                            tooltip : "View More",
                            onClick : () => 
                            {
                                this.props.viewMore(row);
                            }
                        }),
                    ]}
                />
            </TableCellHover>
        );
    }
}