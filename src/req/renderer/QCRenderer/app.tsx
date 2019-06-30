import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {Fastq} from "../../fastq";
import {AtomicOperation} from "../../operations/atomicOperations";
import {QCReportsTable} from "../containers/qCReportsTable";
import {QCReport} from "../containers/qcReport";

import {generateFastQCReport} from "./publish";

export interface QCRendererAppState {
    fastqs?: Array<Fastq>;
    shouldAllowTriggeringOps : boolean;

    viewingReport : boolean;
    viewUuid : string | undefined;
}

export class QCRendererApp extends React.Component<{}, QCRendererAppState>
{
    public state: QCRendererAppState;
    public constructor() 
    {
        super(undefined);
        this.state = {
            shouldAllowTriggeringOps: true
        } as QCRendererAppState;

        ipc.on("QC", (event: Electron.IpcMessageEvent, arg: any) => 
        {
            if (arg.action == "getKey" || arg.action == "keyChange") 
            {
                if (arg.key == "fastqInputs") 
                {
                    //Update fastq list and rerender
                    if (arg.val !== undefined) 
                    {
                        this.setState({fastqs: arg.val});
                        return;
                    }
                }
                //occasionally when docking, we can recieve the deleted window docking operation
                try 
                {
                    if (arg.key == "operations") 
                    {
                        //On update from running jobs
                        let operations: Array<AtomicOperation> = arg.val;
                        let found = false;
                        for (let i: number = 0; i != operations.length; ++i) 
                        {
                            //look for only report generation jobs
                            if (operations[i].name == "generateFastQCReport") 
                            {
                                found = true;
                                this.setState({
                                    shouldAllowTriggeringOps: false
                                });
                            }
                        }
                        if (!found) 
                        {
                            this.setState({
                                shouldAllowTriggeringOps: true
                            });
                        }
                    }

                }
                catch (err) 
                {
                    err;
                }
            }
        }
        );
    }

    public render() : JSX.Element
    {
        return (
            <React.Fragment>
                {!this.state.viewingReport ? 
                    <QCReportsTable
                        data={this.state.fastqs}
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
                        fastqs={this.state.fastqs}
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
