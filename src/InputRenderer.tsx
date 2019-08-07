import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";

import {InputView, InputViewProps} from "./req/renderer/views/inputView/inputView";
import {GetKeyEvent, KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";
import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import {renderAppRoot} from "./req/renderer/renderAppRoot";

class InputApp extends React.Component<{},InputViewProps>
{
    public state : InputViewProps;
    public constructor()
    {
        super({});

        this.state = {

        } as InputViewProps;

        ipc.on("input",(event : Electron.IpcMessageEvent,arg : any) => 
        {
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

                if(arg.key == "aligns")
                {
                    this.setState({aligns : arg.val});
                }

                if(arg.key == "operations")
                {
                    if(arg.val !== undefined)
                    {
                        this.setState({operations : arg.val});
                        
                    }
                }

            }
        });
    }

    public render() : JSX.Element
    {
        return (
            <InputView
                fastqs={this.state.fastqs}
                fastas={this.state.fastas}
                aligns={this.state.aligns}
                operations={this.state.operations}
            />
        );
    }
}

renderAppRoot(
    () => <InputApp />,
    document.getElementById("app") as HTMLDivElement
);

makeWindowDockable("input");
//get saved data
ipc.send(
    "getKey",
    {
        channel: "input",
        key: "fastqInputs",
        replyChannel: "input",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "input",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        channel: "align",
        key: "aligns",
        replyChannel: "input",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "application",
        key: "operations",
        replyChannel: "input"
    } as GetKeyEvent
);

//subscribe to changes in data
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "input"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "input"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        channel: "align",
        key: "aligns",
        replyChannel: "input",
        action: "keySub"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "input"
    } as KeySubEvent
);
//}

