import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";
import {cssRule} from "typestyle";
import {color} from "csx";

import {KeySubEvent, GetKeyEvent} from "./req/ipcEvents";
import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import {ToolBarView, ToolBarViewProps} from "./req/renderer/views/toolBarView/toolBarView";
import {AtomicOperation} from "./req/operations/atomicOperations";
import formatByteString from "./req/renderer/formatByteString";
import {renderAppRoot} from "./req/renderer/renderAppRoot";

cssRule("body",{
    backgroundColor : `${color("#1a89bd")}`
});

class ToolBarApp extends React.Component<{},ToolBarViewProps>
{
    public state : ToolBarViewProps;
    public constructor()
    {
        super(undefined);

        ipc.on(
            "toolBar",(event : Electron.IpcMessageEvent,arg : any) =>
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
                        if(arg.val === undefined)
                            return;
                        let ops : Array<AtomicOperation> = arg.val;
                        let runningOpNotification : HTMLElement = document.getElementById("runningOpNotification");
                        let foundRunning = false;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(!ops[i])
                                continue;
                                
                            if(ops[i].running)
                            {
                                foundRunning = true;
                                let text = "";
                                if(ops[i].progressMessage)
                                {
                                    text += `${ops[i].progressMessage}`;
                                }

                                this.setState({
                                    runningOpText : text
                                });
                            }

                            if(ops[i].name == "saveProject")
                            {
                                let savingMessage = "";
                                if(ops[i].extraData !== undefined)
                                {
                                    savingMessage += `
                                        Saved ${formatByteString(ops[i].extraData.bytesSaved)} of ${formatByteString(ops[i].extraData.totalBytesToSave)}
                                    `;
                                }
                                this.setState({
                                    saveText : savingMessage
                                });
                            }
                        }
                        if(!foundRunning)
                        {
            
                            this.setState({
                                runningOpText : ""
                            });
                            
                        }

                        this.setState({
                            operations : ops
                        });
                    }
                }
            }
        );
    }

    public render() : JSX.Element
    {
        return (
            <ToolBarView {...this.state} />
        );
    }
}

renderAppRoot(
    () => <ToolBarApp />,
    document.getElementById("app") as HTMLDivElement
);

ipc.send(
    "getKey",
    {
        channel: "input",
        key: "fastqInputs",
        replyChannel: "toolBar",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "toolBar",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        channel: "align",
        key: "aligns",
        replyChannel: "toolBar",
        action: "getKey"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "application",
        key: "operations",
        replyChannel: "toolBar"
    } as GetKeyEvent
);

ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "toolBar"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "toolBar"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        channel: "align",
        key: "aligns",
        replyChannel: "toolBar",
        action: "keySub"
    } as KeySubEvent
);

ipc.send(
    "keySub",
            {
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "toolBar"
            } as KeySubEvent
);
        