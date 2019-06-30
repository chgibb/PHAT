import * as React from "react";

import {AlignData} from "../../alignData";
import {Table} from "../components/table";
import {sweepToBottom} from "../styles/sweepToBottom";
import { TableCellHover } from './tableCellHover';


export interface AlignmentsReportTableProps {
    aligns?: Array<AlignData>;
}

export class AlignmentsReportTable extends React.Component<AlignmentsReportTableProps, {}>
{
    public constructor(props: AlignmentsReportTableProps) 
    {
        super(props);
    }

    public SNPCellId(row : AlignData) : string
    {
        return `${row.uuid}SNP`;
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
                            tooltip : "SNPs",
                            render : (rowData : AlignData) => 
                            {
                                return (
                                    <div>
                                        <p>{rowData.uuid}</p>
                                    </div>
                                );
                            }
                        }
                    ]}
                    onRowClick={(event : React.MouseEvent<HTMLElement>,rowData : AlignData,toggleDetailPanel) => 
                    {
                        event.persist();

                        let el : HTMLElement | undefined;

                        let target = (event.target as HTMLElement);

                        if(target.id)
                            el = target;
                        
                        else if ((target.firstChild as HTMLElement).id)
                            el = (target.firstChild as HTMLElement);
                       
                        if(el)
                        {
                            if(this.SNPCellId(rowData) == el.id)
                            {
                                toggleDetailPanel(0);
                            }
                        }
                    }}
                    columns={[
                        {
                            title: "Alias",
                            render: (row: AlignData) => 
                            {
                                return row.alias;
                            }
                        },
                        {
                            title: "Aligner",
                            render: (row: AlignData) => 
                            {
                                return row.alignerUsed;
                            }
                        },
                        {
                            title: "Size In Bytes",
                            render: (row: AlignData) => 
                            {
                                return row.size;
                            }
                        },
                        {
                            title: "Formatted Size",
                            render: (row: AlignData) => 
                            {
                                return row.sizeString;
                            }
                        },
                        {
                            title: "Reads",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.reads : row.flagStatReport.reads;
                            }
                        },
                        {
                            title: "Mates",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.mates : "Unknown";
                            }
                        },
                        {
                            title: "Overall Alignment Rate %",
                            render: (row: AlignData) => 
                            {
                                return !row.isExternalAlignment ? row.summary.overallAlignmentRate : row.flagStatReport.overallAlignmentRate;
                            }
                        },
                        {
                            title: "Minimum Coverage",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minCoverage : "Unknown";
                            }
                        },
                        {
                            title: "Minimum Variable Frequency",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minVarFreq : "Unknown";
                            }
                        },
                        {
                            title: "Minimum Average Quality",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.minAvgQual : "Unknown";
                            }
                        },
                        {
                            title: "P-Value Threshold",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.pValueThresh : "Unknown";
                            }
                        },
                        {
                            title: "SNPs Predicted",
                            cellStyle: sweepToBottom as any,
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? (<div id={this.SNPCellId(row)} className={TableCellHover.cellHoverClass}>{row.varScanSNPSummary.SNPsReported}</div>) : "Unknown";
                            }
                        },
                        {
                            title: "Indels Predicted",
                            render: (row: AlignData) => 
                            {
                                return row.varScanSNPSummary ? row.varScanSNPSummary.indelsReported : "Unknown";
                            }
                        },
                        {
                            title: "BLAST Runs",
                            render: (row: AlignData) => 
                            {
                                return row.BLASTSegmentResults ? row.BLASTSegmentResults.length : 0;
                            }
                        },
                        {
                            title: "Date Ran",
                            render: (row: AlignData) => 
                            {
                                return row.dateStampString;
                            }
                        },
                    ]}
                />
            </TableCellHover>
        );
    }
}