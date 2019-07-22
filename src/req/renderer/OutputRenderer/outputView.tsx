import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fasta} from "../../fasta";
import {AlignData} from "../../alignData";
import {Fastq} from "../../fastq";
import {AlignmentsReportTable} from "../containers/tables/alignmentsReportTable";

export interface OutputViewProps
{
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
}

export class OutputView extends React.Component<OutputViewProps,{}>
{
    public constructor(props : OutputViewProps)
    {
        super(props);
    }

    public render() : JSX.Element
    {
        return (
            <div>
                <AlignmentsReportTable
                    aligns={this.props.aligns}
                    fastas={this.props.fastas}
                />
            </div>
        );
    }
}
