import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {Component} from "react";

import {Fastq} from "../../fastq";
import {Fasta} from "../../fasta";
import {AtomicOperation} from "../../operations/atomicOperations";
import {FullWidthStepper, FullWidthStepperForm, FullWidthStepperProps, FullWidthStep} from "../containers/fullWidthStepper";
import {FastqTable} from "../containers/fastqTable";
import {reOrder} from "../../reOrder";
import {GridWrapper} from "../containers/gridWrapper";
import {Grid} from "../components/grid";
import {Typography} from "../components/typography";
import {VerticalDnD, DropResult, ResponderProvided} from "../containers/verticalDnD";
import {Paper} from "../components/paper";
import {paperPadding} from "../styles/paperPadding";

import {headingPadding} from "./styles/headingPadding";
import { FastaTable } from '../containers/fastaTable';

export interface AlignRendererAppState
{
    fastqs? : Array<Fastq>;
    selectedFastqUuids? : Array<string>;
    fastas? : Array<Fasta>;
    shouldAllowTriggeringOps : boolean;
    errors : Array<string>;
    currentStep : number;
}

export class AlignRendererApp 
    extends Component<{},AlignRendererAppState>
    implements FullWidthStepperForm
{
    public state : AlignRendererAppState;
    public portal : HTMLElement;
    public constructor()
    {
        super(undefined);
        
        this.state = {
            currentStep : 0
        } as AlignRendererAppState;

        this.onFastqSelectionChange = this.onFastqSelectionChange.bind(this);
        this.onStepTwoDragEnd = this.onStepTwoDragEnd.bind(this);
        this.setState = this.setState.bind(this);

        this.portal = document.createElement("div");
        document.body.appendChild(this.portal);

        ipc.on
        (
            "align",(event : Electron.IpcMessageEvent,arg : any) =>
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            this.setState({fastqs: arg.val});
                        }
                    }
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            this.setState({fastas: arg.val});
                        }
                    }
                    let found = false;
                    if(arg.key == "operations")
                    {
                        if(arg.val !== undefined)
                        {
                            let ops : Array<AtomicOperation> = arg.val;
                            try
                            {
                                for(let i = 0; i != ops.length; ++i)
                                {
                                    if(ops[i].name == "indexFastaForBowtie2" || ops[i].name == "runBowtie2Alignment" || ops[i].name == "indexFastaForHisat2" || ops[i].name == "runHisat2Alignment")
                                    {
                                        this.setState({
                                            shouldAllowTriggeringOps: false
                                        });
                                    }
                                }
                            }
                            catch(err)
                            {}
                        }
                    }
                    if(!found)
                    {
                        this.setState({
                            shouldAllowTriggeringOps: true
                        });
                    }
                }
            }
        );
    }

    public onAdvance(step : number) : Promise<boolean>
    {
        return new Promise<boolean>((resolve : (val : boolean) => void) : void =>  
        {
            console.log(step);
            if(step == 0)
            {
                if(!this.state.selectedFastqUuids || this.state.selectedFastqUuids.length < 1 || this.state.selectedFastqUuids.length > 2)
                {
                    this.setState({
                        errors : ["Select at at least 1 fastq but no more than 2."]
                    });
                    return resolve(false);
                }
            }
            this.setState({
                errors: []
            });
            return resolve(true);
        });
    }

    public onFastqSelectionChange(data : Array<Fastq>) : void
    {
        this.setState({
            selectedFastqUuids : data.map((el) => el.uuid)
        });
    }

    public onStepTwoDragEnd(result : DropResult,provider : ResponderProvided) : void
    {
        if(!result.destination)
            return;
        this.setState({
            selectedFastqUuids : reOrder(
                this.state.selectedFastqUuids,
                result.source.index,
                result.destination.index
            )});
    }

    public render() : JSX.Element
    {
        let selectedFastqsAliases : Array<string> | undefined = undefined;
        let selectedFastqsObjs : Array<Fastq> | undefined = undefined;

        if(this.state.fastqs && this.state.selectedFastqUuids)
        {
            selectedFastqsAliases = [];
            this.state.selectedFastqUuids.map((uuid) => 
            {
                selectedFastqsAliases.push(this.state.fastqs.find((el) => 
                {
                    return el.uuid == uuid;
                }).alias);
            });

            selectedFastqsObjs = [];
            this.state.selectedFastqUuids.map((uuid) => 
            {
                selectedFastqsObjs.push(this.state.fastqs.find((el) => 
                {
                    return el.uuid == uuid;
                }));
            });
        }

        

        let steps : Array<FullWidthStep> = new Array();

        steps.push({
            label : !this.state.selectedFastqUuids || this.state.selectedFastqUuids.length == 0 ? "Select fastq(s) to align" : `Selected${"\n"}${selectedFastqsAliases.join(",\n")}`,
            body : (
                <FastqTable
                    selection={true}
                    onSelectionChange={this.onFastqSelectionChange}
                    data={this.state.fastqs}
                />
            )
        });

        if(this.state.selectedFastqUuids && this.state.selectedFastqUuids.length > 1)
        {
            let stepTwoLabel = "Select orientation";
            
            if(this.state.currentStep >= 1 && selectedFastqsObjs && selectedFastqsObjs.length > 0)
            {
                stepTwoLabel = `Forward: ${selectedFastqsObjs[0].alias}${"\n"}`;

                if(selectedFastqsObjs.length > 1)
                    stepTwoLabel += `${"\n"}Reverse: ${selectedFastqsObjs[1].alias}${"\n"}`;
            }

            steps.push({
                label : stepTwoLabel,
                body : (
                    <div>
                        {this.state.selectedFastqUuids ?
                            <GridWrapper>
                                <Grid container spacing={4} justify="center">
                                    <Grid item>
                                        <Typography className={headingPadding}>
                                            Forward
                                        </Typography>
                                        <Typography>
                                            Reverse
                                        </Typography>
                                    </Grid>
                                    <Grid item>

                                        <VerticalDnD<Fastq>
                                            onDragEnd={this.onStepTwoDragEnd}
                                            droppableID="droppable"
                                            draggableKey={(el) => el.uuid}
                                            draggableId={(el) => el.uuid}
                                            draggableContent={(el) => 
                                            {
                                                return (
                                                    <Paper className={paperPadding}>
                                                        <Typography variant="h5" component="h3">
                                                            {el.alias}
                                                        </Typography>
                                                        <Typography component="p">
                                                            {el.sizeString}
                                                        </Typography>
                                                    </Paper>
                                                );
                                            }}
                                            portal={this.portal}
                                            data={selectedFastqsObjs}
                                        />
                                    </Grid>
                                </Grid>
                            </GridWrapper> 
                            : ""}
                    </div>
                )
            });
        }

        steps.push({
            label : "Select reference to align against",
            body : (
                <div>
                    <FastaTable
                        actions={false}
                        data={this.state.fastas}
                        shouldAllowTriggeringOps={true}
                        onIndexForVizClick={()=>null}
                    />
                </div>
            )
        });

        steps.push({
            label : "Select aligner",
            body : (
                <p>Fourth</p>
            )
        });

        return (
            <div>
                <div>
                    <FullWidthStepper 
                        form={this}
                        setFormState={this.setState}
                        steps={steps}
                    />
                </div>
            </div>
        );
    }
}
