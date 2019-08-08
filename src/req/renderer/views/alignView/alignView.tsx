import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fastq} from "../../../fastq";
import {Fasta} from "../../../fasta";
import {AtomicOperation} from "../../../operations/atomicOperations";
import {RunAlignmentForm} from "../../containers/forms/runAlignment/runAlignmentForm";

export interface AlignViewState
{
    shouldAllowTriggeringOps? : boolean;
}

export interface AlignViewProps
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    operations? : Array<AtomicOperation<any>>;
}

export class AlignView  extends React.Component<AlignViewProps,AlignViewState>
{
    public state : AlignViewState;
    public constructor(props : AlignViewProps)
    {
        super(props);
        
        this.state = {
            shouldAllowTriggeringOps : true
        } as AlignViewState;
    }

    public componentDidUpdate() : void
    {
        if(!this.props.operations)
            return;

        let found = false;
        for(let i = 0; i != this.props.operations.length; ++i)
        {
            if(this.props.operations[i].operationName == "indexFastaForBowtie2" || this.props.operations[i].operationName == "runBowtie2Alignment" || this.props.operations[i].operationName == "indexFastaForHisat2" || this.props.operations[i].operationName == "runHisat2Alignment")
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
                <RunAlignmentForm
                    fastas={this.props.fastas}
                    fastqs={this.props.fastqs}
                    shouldAllowTriggeringOps={this.state.shouldAllowTriggeringOps ? this.state.shouldAllowTriggeringOps : true}
                />
            </div>
        );
    }
}
