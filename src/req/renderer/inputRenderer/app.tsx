import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {Component} from "react";

import {Fastq} from './../../fastq';
import {Fasta} from "./../../fasta";
import {getReadable} from '../../getAppPath';

import {activeHover,activeHoverButton} from "./../styles/activeHover";
import {FastqView} from './fastqView';
import {FastaView} from "./fastaView";
import { AtomicOperation } from '../../operations/atomicOperations';
import { FullWidthTabs } from '../containers/fullWidthTabs';

export interface AppState
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    shouldAllowTriggeringOps : boolean;
}

export class App extends Component<{},AppState>
{
    public state : AppState;
    public constructor()
    {
        super(undefined);
        this.state = {
            shouldAllowTriggeringOps : true
        };

        ipc.on('input',(event : Electron.IpcMessageEvent,arg : any) => {
            if(arg.action == "getKey" || arg.action == "keyChange")
            {
                if(arg.key == "fastqInputs")
                {
                    this.setState({fastqs : arg.val});
                    return;
                }

                if(arg.key == "fastaInputs")
                {
                    this.setState({fastas : arg.val});
                    return;
                }

                let found = false;
                if(arg.key == "operations")
                {
                    if(arg.val !== undefined)
                    {
                        let ops : Array<AtomicOperation> = arg.val;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].name == "inputBamFile" || ops[i].name == "linkRefSeqToAlignment" ||
                            ops[i].name == "indexFastaForVisualization" || ops[i].name == "indexFastaForBowtie2Alignment" ||
                            ops[i].name == "linkRefSeqToAlignment" || ops[i].name == "importFileIntoProject")
                            {
                                found = true;
                                break;
                            }
                        }
                    }
                }
                
                this.setState({
                    shouldAllowTriggeringOps : !found
                });
            }
        });
    }

    public render()
    {
        return (
            <div>
                <FullWidthTabs tabs={[
                    {
                        label : "Fastqs",
                        body : (
                            <FastqView fastqInputs={this.state.fastqs} />
                        )
                    },
                    {
                        label : "References",
                        body : (
                            <FastaView fastaInputs={this.state.fastas} shouldAllowTriggeringOps={this.state.shouldAllowTriggeringOps} />
                        )
                    }
                ]}/>
            </div>
        )
    }
}
