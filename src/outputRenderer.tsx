import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";

import "./req/renderer/styles/defaults";
import "./req/renderer/commonBehaviour";
import {OutputView, OutputViewProps} from "./req/renderer/views/outputView/outputView";
import {renderAppRoot} from "./req/renderer/renderAppRoot";

class OutputApp extends React.Component<{},OutputViewProps>
{
    public state : OutputViewProps;

    public constructor()
    {
        super(undefined);

        this.state = {

        } as OutputViewProps;

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
            <OutputView
                fastqs={this.state.fastqs}
                fastas={this.state.fastas}
                aligns={this.state.aligns}
            />
        );
    }
}

renderAppRoot(
    () => <OutputApp />,
    document.getElementById("app") as HTMLDivElement
);

makeWindowDockable("output");

ipc.send(
    "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            } as KeySubEvent
);

ipc.send(
    "getKey",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            } as KeySubEvent
);

ipc.send(
    "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "output"
            } as KeySubEvent
);

ipc.send(
    "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "output"
            } as GetKeyEvent
);

ipc.send(
    "getKey",
            {
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "output"
            } as GetKeyEvent
);

ipc.send(
    "keySub",
            {
                action : "keySub",
                channel : "align",
                key : "aligns",
                replyChannel : "output"
            } as KeySubEvent
);