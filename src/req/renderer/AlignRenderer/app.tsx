import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {Component} from "react";

import {Fastq} from "../../fastq";
import {Fasta} from "../../fasta";
import {AtomicOperation} from "../../operations/atomicOperations";
import { FullWidthStepper, FullWidthStepperForm} from '../containers/fullWidthStepper';
import { FastqTable } from '../containers/fastqTable';
import { reOrder } from '../../reOrder';
import { ListItem } from '../components/listItem';
import { ListItemText } from '../components/listItemText';
import { GridWrapper } from '../containers/gridWrapper';
import {Grid} from "../components/grid";
import { Typography } from '../components/typography';
import { VerticalDnD, DropResult, ResponderProvided } from '../containers/verticalDnD';

export interface AlignRendererAppState
{
    fastqs? : Array<Fastq>;
    selectedFastqUuids? : Array<string>;
    fastas? : Array<Fasta>;
    shouldAllowTriggeringOps : boolean;
    errors : Array<string>;
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

        } as AlignRendererAppState;

        this.onFastqSelectionChange = this.onFastqSelectionChange.bind(this);
        this.onStepTwoDragEnd = this.onStepTwoDragEnd.bind(this);

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
        return new Promise<boolean>((resolve : (val : boolean) => void) : void =>  {
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
        let selectedFastqs : Array<string> | undefined = undefined;

        if(this.state.fastqs && this.state.selectedFastqUuids)
        {
            selectedFastqs = [];
            this.state.selectedFastqUuids.map((uuid) => {
                selectedFastqs.push(this.state.fastqs.find((el) => {
                    return el.uuid == uuid;
                }).alias);
            });
        }
        return (
            <div>
                <div>
                <FullWidthStepper 
                    form={this}
                    steps={[
                        {
                            label : !this.state.selectedFastqUuids || this.state.selectedFastqUuids.length == 0 ? "Select fastq(s) to align" : `Selected${"\n"}${selectedFastqs.join(",\n")}`,
                            body : (
                                <FastqTable
                                    selection={true}
                                    onSelectionChange={this.onFastqSelectionChange}
                                    data={this.state.fastqs}
                                />
                            )
                        },
                        {
                            label : "Select orientation",
                            body : (
                                <div>
                                    {this.state.selectedFastqUuids ?
                                        <GridWrapper>
                                            <Grid container spacing={4} justify="center">
                                            <Grid item>
                                                <Typography>
                                                    Forward
                                                </Typography>
                                                <Typography>
                                                    Reverse
                                                </Typography>
                                            </Grid>
                                            <Grid item>

                                                <VerticalDnD<string>
                                                    onDragEnd={this.onStepTwoDragEnd}
                                                    droppableID="droppable"
                                                    draggableKey={(el) => el}
                                                    draggableId={(el) => el}
                                                    draggableContent={(el) => {
                                                        return (
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary={el}
                                                                />
                                                            </ListItem>
                                                        );
                                                    }}
                                                    portal={this.portal}
                                                    data={this.state.selectedFastqUuids}
                                                />
                                        </Grid>
                                        </Grid>
                                        </GridWrapper> 
                                    : ""}
                                </div>
                            )
                        },
                        {
                            label : "Select reference to align against",
                            body : (
                                <p>Third</p>
                            )
                        },
                        {
                            label : "Select aligner",
                            body : (
                                <p>Fourth</p>
                            )
                        },
                    ]}
                />
            </div>
            </div>
        );
    }
}
