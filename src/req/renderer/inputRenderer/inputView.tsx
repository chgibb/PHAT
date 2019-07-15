import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {AtomicOperation} from "../../operations/atomicOperations";
import {FullWidthTabs, FullWidthTab} from "../containers/fullWidthTabs";
import {AlignData} from "../../alignData";
import {Tab} from "../components/tab";

import {Fastq} from "../../fastq";
import {Fasta} from "../../fasta";
import {FastqView} from "./fastqView";
import {FastaView} from "./fastaView";
import {AlignView} from "./alignView";
import { PHATView } from '../phatView';

export interface InputViewState
{
    shouldAllowTriggeringOps : boolean;
}


export interface InputViewProps
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
    operations? : Array<AtomicOperation>;
    
}

export class InputView extends React.Component<InputViewProps,{}> implements PHATView
{
    public state : InputViewState;
    public constructor(props : InputViewProps)
    {
        super(props);
        this.state = {
            shouldAllowTriggeringOps : true
        };
    }

    public componentDidUpdate() : void
    {
        if(!this.props.operations)
            return;
        let found = false;
        for(let i = 0; i != this.props.operations.length; ++i)
                        {
                            if(this.props.operations[i].name == "inputBamFile" || this.props.operations[i].name == "linkRefSeqToAlignment" ||
                            this.props.operations[i].name == "indexFastaForVisualization" || this.props.operations[i].name == "indexFastaForBowtie2Alignment" ||
                            this.props.operations[i].name == "linkRefSeqToAlignment" || this.props.operations[i].name == "importFileIntoProject")
                            {
                                found = true;
                                break;
                            }
                        }
                        this.setState({
                            shouldAllowTriggeringOps : !found
                        });
    }

    public render()
    {
        return (
            <div style={{backgroundColor:"white"}}>
                <FullWidthTabs 
                    tabComponent={(el : FullWidthTab) => (
                        <Tab className={el.className} label={el.label} />
                    )}
                    tabs={[
                        {
                            label : "Fastqs",
                            body : (
                                <FastqView 
                                    fastqInputs={this.props.fastqs} 
                                />
                            )
                        },
                        {
                            label : "References",
                            body : (
                                <FastaView 
                                    fastaInputs={this.props.fastas} 
                                    shouldAllowTriggeringOps={this.state.shouldAllowTriggeringOps} 
                                />
                            ),
                            className : "refSeqViewButton"
                        },
                        {
                            label : "Alignment Maps",
                            body : (
                                <AlignView 
                                    aligns={this.props.aligns}
                                    fastaInputs={this.props.fastas}
                                />
                            )
                        }
                    ]}/>
            </div>
        );
    }
}
