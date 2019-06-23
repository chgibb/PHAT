import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {Component} from "react";
import {createPortal} from "react-dom";
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

import {Fastq} from "../../fastq";
import {Fasta} from "../../fasta";
import {AtomicOperation} from "../../operations/atomicOperations";
import { FullWidthStepper, FullWidthStepperForm} from '../containers/fullWidthStepper';
import { FastqTable } from '../containers/fastqTable';
import { reOrder } from '../../reOrder';
import { ListItem } from '../components/listItem';
import { ListItemText } from '../components/listItemText';

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
                                        <DragDropContext onDragEnd={this.onStepTwoDragEnd}>
                                            <Droppable droppableId="droppable">
                                                {(provided : DroppableProvided,snapshot : DroppableStateSnapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {this.state.selectedFastqUuids.map((el,i) => (
                                                            <Draggable key={el} draggableId={el} index={i}>
                                                                {(provided : DraggableProvided,snapshot : DraggableStateSnapshot) => {
                                                                    const node : JSX.Element = (
                                                                        <div
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            ref={provided.innerRef}
                                                                            ><ListItem>
                                                                                <ListItemText
                                                                                    primary={el}
                                                                                />
                                                                            </ListItem></div>
                                                                    );
                                                                    
                                                                    if(snapshot.isDragging)
                                                                        return createPortal(node,this.portal);
                                                                    
                                                                    return node;
                                                                }}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
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
