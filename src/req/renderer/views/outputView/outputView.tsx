import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fasta} from "../../../fasta";
import {AlignData} from "../../../alignData";
import {Fastq} from "../../../fastq";
import {AlignmentsReportTable} from "../../containers/tables/alignmentsReportTable";
import {TableCellHover} from "../../containers/tableCellHover";
import {AtomicOperationIPC} from "../../../atomicOperationsIPC";
import {SNPPositionsTable} from "../../containers/tables/snpPositionsTable";
import {Button} from "../../components/button";
import {Dialog} from "../../components/dialog";
import {DialogTitle} from "../../components/dialogTitle";
import {DialogActions} from "../../components/dialogActions";
import {ReadsPerContigTable} from "../../containers/tables/readsPerContigTable";
import {BLASTRunsTable} from "../../containers/tables/BLASTRunsTable";
import { enQueueOperation } from '../../enQueueOperation';

export interface OutputViewState
{
    currentTable : "reports" | "snps" | "contigs" | "blastRuns";
    clickedRow? : AlignData;
    viewMoreDialogOpen : boolean;
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
                    
                    <Dialog
                        open={this.state.viewMoreDialogOpen}
                        onClose={() => 
                        {
                            this.setState({
                                viewMoreDialogOpen : false
                            });
                        }}
                    >
                        <DialogTitle>
                            View Other Reports For This Alignment
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                id="readsAlignedPerContig"
                                label="Reads Aligned Per Contig"
                                type="advance"
                                onClick={()=> 
                                {
                                    this.setState({
                                        currentTable : "contigs",
                                        viewMoreDialogOpen : false
                                    });
                                }}
                            />
                            <Button
                                id="predictedSnps"
                                label="Predicted SNPs"
                                type="advance"
                                onClick={()=> 
                                {
                                    this.setState({
                                        currentTable : "snps",
                                        viewMoreDialogOpen : false
                                    });
                                }}
                            />
                            <Button
                                id="BlastRuns"
                                label="BLAST Runs"
                                type="advance"
                                onClick={() => 
                                {
                                    this.setState({
                                        currentTable : "blastRuns",
                                        viewMoreDialogOpen : false
                                    });
                                }}
                            />
                        </DialogActions>
                    </Dialog>
                    
                }
                {
                    this.state.currentTable == "reports" ? 
                        <AlignmentsReportTable
                            viewMore={(rowData : AlignData) => 
                            {
                                this.setState({
                                    viewMoreDialogOpen : true,
                                    clickedRow : rowData
                                });
                            }}
                            aligns={this.props.aligns}
                            fastas={this.props.fastas}
                            onRowClick={(event: React.MouseEvent | undefined, rowData: AlignData | undefined) => 
                            {
                                if(!rowData)
                                    return;
                                    
                                let el = TableCellHover.getClickedCell(event);
    
                                if (el) 
                                {
                                    if (AlignmentsReportTable.SNPCellId(rowData) == el.id) 
                                    {
                                        this.setState({
                                            currentTable : "snps",
                                            clickedRow : rowData
                                        });
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
                                    
                                        for (let k = 0; k != this.props.fastas!.length; ++k) 
                                        {
    
                                            if (rowData.fasta && this.props.fastas![k].uuid == rowData.fasta.uuid) 
                                            {
                                                fasta = this.props.fastas![k];
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
                                        
                                        enQueueOperation({
                                            opName: "openPileupViewer",

                                                align: rowData,
                                                contig: fasta.contigs[0].name.split(" ")[0],
                                                start: 0,
                                                stop: 100
                                            
                                        });
                                    }
    
                                    else if(AlignmentsReportTable.BLASTRunsCellId(rowData) == el.id)
                                    {
                                        this.setState({
                                            currentTable : "blastRuns",
                                            clickedRow : rowData
                                        });
                                    }
                                }
                            }}
                        /> : this.state.currentTable == "snps" ?
                            <div>
                                <Button
                                    label="Go Back"
                                    type="retreat"
                                    onClick={() => 
                                    {
                                        this.setState({
                                            currentTable : "reports"
                                        });
                                    }}
                                />
                                <SNPPositionsTable
                                    align={this.state.clickedRow}
                                    fastas={this.props.fastas ? this.props.fastas : []}
                                />
                            </div> : this.state.currentTable == "contigs" ? 
                                <div>
                                    <Button
                                        label="Go Back"
                                        type="retreat"
                                        onClick={() => 
                                        {
                                            this.setState({
                                                currentTable : "reports"
                                            });
                                        }}
                                    />
                                    <ReadsPerContigTable
                                        align={this.state.clickedRow}
                                    />
                                </div> : this.state.currentTable == "blastRuns" ?
                                    <div>
                                        <Button
                                            label="Go Back"
                                            type="retreat"
                                            onClick={() => 
                                            {
                                                this.setState({
                                                    currentTable : "reports"
                                                });
                                            }}
                                        />
                                        <BLASTRunsTable
                                            align={this.state.clickedRow}
                                        />
                                    </div> : null 
                }
            </div>
        );
    }
}
