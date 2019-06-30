import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fastq} from "../../fastq";
import {Fasta} from "../../fasta";
import {AtomicOperation} from "../../operations/atomicOperations";
import {RunAlignmentForm} from "../containers/forms/runAlignment/runAlignmentForm";

export interface AlignRendererAppState
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    shouldAllowTriggeringOps? : boolean;
}

export class AlignRendererApp  extends React.Component<{},AlignRendererAppState>
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
