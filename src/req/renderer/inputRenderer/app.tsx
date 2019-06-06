import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {Component} from "react";

const Button : typeof import("@material-ui/core/Button").default = require("@material-ui/core/Button").default;

import {Fastq} from './../../fastq';
import {Fasta} from "./../../fasta";
import {getReadable} from '../../getAppPath';

import {activeHover,activeHoverButton} from "./../styles/activeHover";
import {FastqView} from './fastqView';
import {FastaView} from "./fastaView";
import { AtomicOperation } from '../../operations/atomicOperations';

export interface AppState
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    tab : "fastq" | "ref" | "align";
    shouldAllowTriggeringOps : boolean;
}

export class App extends Component<{},AppState>
{
    public state : AppState;
    public constructor()
    {
        super(undefined);
        this.state = {
            tab : "fastq",
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

    public changeTab(tab : "fastq" | "ref" | "align") : void 
    {
        this.setState({
            tab : tab
        });
    }

    public render()
    {
        return (
            <div>
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        this.changeTab("fastq");
                    }}>

                Fastq</Button>
                <img 
                    className={`${activeHover} ${activeHoverButton}`}
                    src={this.state.tab == "ref" ? getReadable("img/refSeqButtonActive.png") : getReadable("img/refSeqButton.png")}
                    onClick={() => {
                        this.changeTab("ref");
                    }}
                />
                <img 
                    className={`${activeHover} ${activeHoverButton}`}
                    src={this.state.tab == "align" ? getReadable("img/alignButtonActive.png") : getReadable("img/alignButton.png")}
                    onClick={() => {
                        this.changeTab("align");
                    }}
                />

                {this.state.tab == "fastq" ? <FastqView fastqInputs={this.state.fastqs} /> : undefined}
                {this.state.tab == "ref" ? <FastaView fastaInputs={this.state.fastas} shouldAllowTriggeringOps={this.state.shouldAllowTriggeringOps}/> : undefined}
            </div>
        )
    }
}
