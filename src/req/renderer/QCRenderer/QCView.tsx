import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fastq} from "../../fastq";
import {AtomicOperation} from "../../operations/atomicOperations";
import {QCReportsTable} from "../containers/tables/qCReportsTable";
import {QCReport} from "../containers/qcReport";

import {generateFastQCReport} from "./publish";

export interface QCViewState
{
    shouldAllowTriggeringOps : boolean;
    viewingReport? : boolean;
    viewUuid? : string | undefined;
}

export interface QCViewProps 
{
    fastqs?: Array<Fastq>;
    operations? : Array<AtomicOperation<any>>;
}

export class QCView extends React.Component<QCViewProps,QCViewState>
{
    public state: QCViewState;
    public constructor(props : QCViewProps) 
    {
        super(props);
        this.state = {
            shouldAllowTriggeringOps: true
        } as QCViewState;
    }

    public componentDidUpdate() : void
    {
        if(!this.props.operations)
            return;

        let found = false;
        for (let i: number = 0; i != this.props.operations.length; ++i) 
        {
            if (this.props.operations[i].opName == "generateFastQCReport") 
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
            <React.Fragment>
                {!this.state.viewingReport ? 
                    <QCReportsTable
                        data={this.props.fastqs ? this.props.fastqs : []}
                        shouldAllowTriggeringOps={true}
                        onGenerateClick={(event, data : Fastq) => 
                        {
                            event;
                            generateFastQCReport(data);
                        }}
                        onViewReportClick={(event,data : Fastq) => 
                        {
                            event;
                            this.setState({
                                viewUuid : data.uuid,
                                viewingReport : true
                            });
                        }}
                    />
                    : ""}
                {this.state.viewingReport && this.state.viewUuid ? 
                    <QCReport
                        fastqs={this.props.fastqs ? this.props.fastqs : []}
                        viewingFastq={this.state.viewUuid}
                        onGoBackClick={() => 
                        {
                            this.setState({
                                viewUuid : "",
                                viewingReport : false
                            });
                        }}
                    />
                    : ""}
            </React.Fragment>
        );
    }
}
