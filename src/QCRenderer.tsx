import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";

import {makeWindowDockable} from "./req/renderer/dock";

import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import {QCView, QCViewState, QCViewProps} from "./req/renderer/QCRenderer/QCView";
import {KeySubEvent, GetKeyEvent} from "./req/ipcEvents";
import {AtomicOperation} from "./req/operations/atomicOperations";

class QCApp extends React.Component<{},QCViewProps>
{
    public state : QCViewProps;
    public constructor()
    {
        super(undefined);

        this.state = {

        } as QCViewProps;

        ipc.on("QC", (event: Electron.IpcMessageEvent, arg: any) => 
        {
            if (arg.action == "getKey" || arg.action == "keyChange") 
            {
                if (arg.key == "fastqInputs") 
                {
                    if (arg.val !== undefined) 
                    {
                        this.setState({fastqs: arg.val});
                        return;
                    }
                }
                if (arg.key == "operations") 
                {
                        
                    if (arg.val !== undefined) 
                    {
                        this.setState({operations: arg.val});
                        return;
                    }
                }

            }
        }
        );
    }

    public render() : JSX.Element
    {
        return (
            <QCView
                fastqs={this.state.fastqs}
                operations={this.state.operations}
            />
        );
    }
}

render(
    <QCApp />,
    document.getElementById("app")
);

makeWindowDockable("QC");

ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "QC"
    } as KeySubEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "application",
        key: "operations",
        replyChannel: "QC"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "QC"
    } as GetKeyEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "QC"
    }
);
