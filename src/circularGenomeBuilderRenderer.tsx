import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import { GetKeyEvent, KeySubEvent } from "./req/ipcEvents";
import { makeWindowDockable } from "./req/renderer/dock";
import "./req/renderer/styles/defaults";
import "./req/renderer/commonBehaviour";
import { CircularGenomeBuilderViewProps, CircularGenomeBuilderView } from './req/renderer/views/circularGenomeBuilderView/circularGenomeBuilderView';
import { renderAppRoot } from './req/renderer/renderAppRoot';

class CircularGenomeBuilderApp extends React.Component<{},CircularGenomeBuilderViewProps>
{
    public state : CircularGenomeBuilderViewProps;

    public constructor()
    {
        super({});

        this.state = {

        } as CircularGenomeBuilderViewProps;

        ipc.on(
            "circularGenomeBuilder",(event : Electron.IpcMessageEvent,arg : any) =>
            {
                if(arg.action === "getKey" || arg.action === "keyChange")
                {
                    if(arg.key == "circularFigures" && arg.val !== undefined)
                    {
                        this.setState({figures : arg.val});
                    }

                    if(arg.key == "fastaInputs" && arg.val !== undefined)
                    {
                        this.setState({fastas : arg.val});
                    }
                }
            });
    }

    public render() : JSX.Element
    {
        return (
            <CircularGenomeBuilderView 
                figures={this.state.figures ? this.state.figures : []}
                fastas={this.state.fastas ? this.state.fastas : []}
            />
        );
    }
}

renderAppRoot(
    () => <CircularGenomeBuilderApp />,
    document.getElementById("app") as HTMLDivElement
);

ipc.send(
    "getKey",
    {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "circularGenomeBuilder",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        channel: "circularGenomeBuilder",
        key: "circularFigures",
        replyChannel: "circularGenomeBuilder",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        channel: "align",
        key: "aligns",
        replyChannel: "circularGenomeBuilder",
        action: "getKey"
    } as GetKeyEvent
);

ipc.send(
    "keySub",
    {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        channel: "circularGenomeBuilder",
        key: "circularFigures",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        channel: "align",
        key: "aligns",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        channel: "application",
        key: "operations",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    } as KeySubEvent
);
