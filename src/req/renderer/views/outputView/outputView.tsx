import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fasta} from "../../../fasta";
import {AlignData} from "../../../alignData";
import {Fastq} from "../../../fastq";
import {AlignmentsReportTable} from "../../containers/tables/alignmentsReportTable";
import { TableCellHover } from '../../containers/tableCellHover';
import { AtomicOperationIPC } from '../../../atomicOperationsIPC';

export interface OutputViewState
{
    currentTable : "reports" | "snps" | "contigs" | "blastRuns";
}

export interface OutputViewProps
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
}

export class OutputView extends React.Component<OutputViewProps,OutputViewState>
{
    public constructor(props : OutputViewProps)
    {
        super(props);

        this.state = {
            currentTable : "reports"
        } as OutputViewState;
    }

    public render() : JSX.Element
    {
        return (
            <div>
                {
                this.state.currentTable == "reports" ? 
                <AlignmentsReportTable
                    aligns={this.props.aligns}
                    fastas={this.props.fastas}
                    onRowClick={(event: React.MouseEvent<HTMLElement>, rowData: AlignData) => 
                        {
                            let el = TableCellHover.getClickedCell(event);
    
                            if (el) 
                            {
                                if (AlignmentsReportTable.SNPCellId(rowData) == el.id) 
                                {
                                    //toggleDetailPanel(0);
                                }
    
                                else if (AlignmentsReportTable.aliasCellId(rowData) == el.id) 
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
    
                                else if(AlignmentsReportTable.BLASTRunsCellId(rowData) == el.id)
                                {
                                    //toggleDetailPanel(2);
                                }
                            }
                        }}
                /> : null
                }
            </div>
        );
    }
}
