import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";
import {cssRule} from "typestyle";
import {color} from "csx";

import {KeySubEvent} from "./req/ipcEvents";

import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import {ToolBarView, ToolBarViewProps} from "./req/renderer/views/toolBarView/toolBarView";
import {AtomicOperation} from "./req/operations/atomicOperations";
import formatByteString from "./req/renderer/formatByteString";

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
                    if(arg.key == "operations")
                    {
                        let ops : Array<AtomicOperation> = arg.val;
                        let runningOpNotification : HTMLElement = document.getElementById("runningOpNotification");
                        let foundRunning = false;
                        for(let i = 0; i != ops.length; ++i)
                        {
                            if(ops[i].running)
                            {
                                foundRunning = true;
                                if(runningOpNotification)
                                {
                                    let text = "";
                                    if(ops[i].progressMessage)
                                    {
                                        text += `${ops[i].progressMessage}`;
                                    }

                                    this.setState({
                                        runningOpText : text
                                    });
                                }
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
                            if(runningOpNotification)
                            {
                                this.setState({
                                    runningOpText : ""
                                });
                            }
                        }
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

render(
    <ToolBarApp />,
    document.getElementById("app")
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
        