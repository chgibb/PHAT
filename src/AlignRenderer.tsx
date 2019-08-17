import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";

import {GetKeyEvent, KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";
import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import {AlignView,AlignViewProps} from "./req/renderer/views/alignView/alignView";
import {renderAppRoot} from "./req/renderer/renderAppRoot";

class AlignApp extends React.Component<{},AlignViewProps>
{
    public state : AlignViewProps;

    public constructor()
    {
        super({});

        this.state = {

        } as AlignViewProps;

        ipc.on(
            "align",(event : Electron.IpcMessageEvent,arg : any) =>
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            this.setState({fastqs: arg.val});
                        }
                    }
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            this.setState({fastas: arg.val});
                        }
                    }
                    
                    if(arg.key == "operations")
                    {
                        if(arg.val !== undefined)
                        {
                            this.setState({operations : arg.val});
                        }
                    }
                }
            }
        );
    }

    public render() : JSX.Element
    {
        return (
            <AlignView
                fastqs={this.state.fastqs}
                fastas={this.state.fastas}
                operations={this.state.operations}
            />
        );
    }
}

renderAppRoot(
    () => <AlignApp />,
    document.getElementById("app") as HTMLDivElement
);

makeWindowDockable("align");

ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "align"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "align"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "application",
        key: "operations",
        replyChannel: "align"
    } as GetKeyEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "align"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "align"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "align"
    } as KeySubEvent
);