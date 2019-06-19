import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import { Component } from "react";
import { Fastq } from '../../fastq';
import { AtomicOperation } from '../../operations/atomicOperations';
import { GenerateQCReport } from '../../operations/GenerateQCReport';
import { QCReportsTable } from '../containers/qCReportsTable';
import { generateFastQCReport } from './publish';

export interface QCRendererAppState {
    fastqs?: Array<Fastq>;
    shouldAllowTriggeringOps: boolean;
}

export class QCRendererApp extends Component<{}, QCRendererAppState>
{
    public state: QCRendererAppState;
    public constructor() {
        super(undefined);
        this.state = {
            shouldAllowTriggeringOps: true
        } as QCRendererAppState;

        let validFastQCOut = new RegExp("[0-9]|[.]", "g");
        let trimOutFastQCPercentage = new RegExp("[0-9][0-9][%]|[0-9][%]", "g");

        ipc.on("QC", (event: Electron.IpcMessageEvent, arg: any) => {
            if (arg.action == "getKey" || arg.action == "keyChange") {
                if (arg.key == "fastqInputs") {
                    //Update fastq list and rerender
                    if (arg.val !== undefined) {
                        this.setState({ fastqs: arg.val });
                        return;
                    }
                }
                //occasionally when docking, we can recieve the deleted window docking operation
                try {
                    if (arg.key == "operations") {
                        //On update from running jobs
                        let operations: Array<AtomicOperation> = arg.val;
                        let found = false;
                        for (let i: number = 0; i != operations.length; ++i) {
                            //look for only report generation jobs
                            if (operations[i].name == "generateFastQCReport") {
                                found = true;
                                this.setState({
                                    shouldAllowTriggeringOps: false
                                });
                            }
                        }
                        if (!found) {
                            this.setState({
                                shouldAllowTriggeringOps: true
                            });
                        }
                    }

                }
                catch (err) {
                    err;
                }
            }
        }
        );
    }

    public render() : JSX.Element
    {
        return (
            <QCReportsTable
                data={this.state.fastqs}
                shouldAllowTriggeringOps={true}
                onGenerateClick={(event, data : Fastq) => {
                    event;
                    generateFastQCReport(data);
                }}
                onViewReportClick={()=>null}
            />
        )
    }
}
