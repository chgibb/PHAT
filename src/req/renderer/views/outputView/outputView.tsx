import * as React from "react";

import {Fasta} from "../../../fasta";
import {AlignData} from "../../../alignData";
import {Fastq} from "../../../fastq";
import {AlignmentsReportTable} from "../../containers/tables/alignmentsReportTable";
import {TableCellHover} from "../../containers/tableCellHover";
import {SNPPositionsTable} from "../../containers/tables/snpPositionsTable";
import {Button} from "../../components/button";
import {Dialog} from "../../components/dialog";
import {DialogTitle} from "../../components/dialogTitle";
import {DialogActions} from "../../components/dialogActions";
import {ReadsPerContigTable} from "../../containers/tables/readsPerContigTable";
import {BLASTRunsTable} from "../../containers/tables/BLASTRunsTable";
import {enQueueOperation} from "../../enQueueOperation";
import {GridWrapper} from "../../containers/gridWrapper";
import {Grid} from "../../components/grid";
import {AlignerDoughnut} from "../../containers/charts/alignerDoughnut";
import {BLASTRunForm} from "../../containers/forms/BLASTRunForm";
import {AtomicOperation} from "../../../operations/atomicOperations";

export interface OutputViewState
{
    currentTable : "reports" | "snps" | "contigs" | "blastRuns";
    showBLASTForm : true | false;
    clickedRow? : AlignData;
    viewMoreDialogOpen : boolean;
    shouldAllowTriggeringOps : boolean;
}

export interface OutputViewProps
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
    operations? : Array<AtomicOperation<any>>;
}

export class OutputView extends React.Component<OutputViewProps,OutputViewState>
{
    public constructor(props : OutputViewProps)
    {
        super(props);

        this.state = {
            currentTable : "reports",
            showBLASTForm : false,
            shouldAllowTriggeringOps : true
        } as OutputViewState;
    }

    public componentDidUpdate() : void
    {
        if(!this.props.operations)
            return;
        
        let found = false;
        for(let i = 0; i != this.props.operations.length; ++i)
        {
            if(this.props.operations[i].opName == "BLASTSegment")
            {
                found = true;
                break;
            }
        }

        if(this.state.shouldAllowTriggeringOps != !found)
        {
            this.setState({
                shouldAllowTriggeringOps : !found
            });
        }
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
                        <div>
                            {this.props.aligns && this.props.aligns.length > 0 ?
                                <GridWrapper>
                                    <Grid container spacing={1} justify="center">
                                        <AlignerDoughnut
                                            aligns={this.props.aligns}
                                            height="50%"
                                            width="50%"
                                            marginBottom="15vh"
                                        />
                                    </Grid>
                                </GridWrapper>
                                :""}
                            <AlignmentsReportTable
                                viewMore={(rowData : AlignData) => 
                                {
                                    this.setState({
                                        viewMoreDialogOpen : true,
                                        clickedRow : rowData
                                    });
                                }}
                                clickableCells={true}
                                toolTipText="View More"
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
                                
                                }
                                }
                            /></div> : this.state.currentTable == "snps" ?
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
                                        <GridWrapper>
                                            <Grid container spacing={4} justify="flex-start">
                                                <Grid item>
                                                    <Button
                                                        label="Go Back"
                                                        type="retreat"
                                                        onClick={() => 
                                                        {
                                                            this.setState({
                                                                currentTable : "reports",
                                                                showBLASTForm : false
                                                            });
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        label="New BLAST Run"
                                                        type="advance"
                                                        onClick={()=>
                                                        {
                                                            this.setState({
                                                                showBLASTForm : true
                                                            });
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </GridWrapper>
                                        {this.state.showBLASTForm ? 
                                            <BLASTRunForm
                                                align={this.state.clickedRow}
                                                shouldAllowTriggeringOps={this.state.shouldAllowTriggeringOps !== undefined ? this.state.shouldAllowTriggeringOps : false}
                                            />    
                                            : 
                                            <BLASTRunsTable
                                                align={this.state.clickedRow}
                                            />}
                                    </div> : null 
                }
            </div>
        );
    }
}
