import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fasta} from "../../fasta";
import {AlignData} from "../../alignData";
import {Fastq} from "../../fastq";
import { AlignmentsReportTable } from '../containers/alignmentsReportTable';

export interface OutputRendererAppState
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
}

export class OutputRendererApp extends React.Component<{},OutputRendererAppState>
{
    public constructor()
    {
        super({});

        this.state = {

        } as OutputRendererAppState;

        ipc.on(
            "output",(event : Electron.IpcMessageEvent,arg : any) =>
            {
                if(arg.action === "getKey" || arg.action === "keyChange")
                {
                    if(arg.key == "fastqInputs" && arg.val !== undefined)
                    {
                        this.setState({fastqs : arg.val});
                    }
                    if(arg.key == "fastaInputs" && arg.val !== undefined)
                    {
                        this.setState({fastas : arg.val});
                    }
                    if(arg.key == "aligns" && arg.val !== undefined)
                    {
                        this.setState({aligns : arg.val});
                    }
                }
            }
        );
    }

    public render() : JSX.Element
    {
        return (
            <div>
                <AlignmentsReportTable
                    aligns={this.state.aligns}
                />
            </div>
        );
    }
}
