import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {Component} from "react";

import {Fastq} from "../../fastq";
import {Fasta} from "../../fasta";
import {AtomicOperation} from "../../operations/atomicOperations";
import {Form, FullWidthFormStep, FullWidthStepperForm} from "../containers/fullWidthStepper";
import {FastqTable} from "../containers/fastqTable";
import {reOrder} from "../../reOrder";
import {GridWrapper} from "../containers/gridWrapper";
import {Grid} from "../components/grid";
import {Typography} from "../components/typography";
import {VerticalDnD, DropResult, ResponderProvided} from "../containers/verticalDnD";
import {Paper} from "../components/paper";
import {paperPadding} from "../styles/paperPadding";
import {FastaTable} from "../containers/fastaTable";
import {FormControl} from "../components/formControl";
import {RadioGroup} from "../components/radioGroup";
import {FormControlLabel} from "../components/formControlLabel";
import {Radio} from "../components/radio";
import {getPropertiesOfReferencesFromUuids, getReferencesFromUuids} from "../../uniquelyAddressable";
import {Button} from "../components/button";
import {ThreeQuartersLoader} from "../components/threeQuartersLoader";

import {headingPadding} from "./styles/headingPadding";
import {triggerBowtie2Alignment, triggerHisat2Alignment} from "../containers/forms/runAlignment/publish";
import { RunAlignmentForm } from '../containers/forms/runAlignment/runAlignmentForm';

export interface AlignRendererAppState
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    shouldAllowTriggeringOps? : boolean;
}

export class AlignRendererApp  extends Component<{},AlignRendererAppState>
{
    public state : AlignRendererAppState;
    public constructor()
    {
        super(undefined);
        
        this.state = {

        } as AlignRendererAppState;

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
                                        found = true;
                                    }
                                }
                            }
                            catch(err)
                            {}
                        }
                    }

                    if(found)
                    {
                        this.setState({
                            shouldAllowTriggeringOps: false
                        });
                    }
                    
                    else
                    {
                        this.setState({
                            shouldAllowTriggeringOps: true
                        });
                    }
                }
            }
        );
    }

    public render() : JSX.Element
    {
        
        return (
            <div>
                <RunAlignmentForm
                    fastas={this.state.fastas}
                    fastqs={this.state.fastqs}
                    shouldAllowTriggeringOps={this.state.shouldAllowTriggeringOps}
                />
            </div>
        );
    }
}
