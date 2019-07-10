import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";


import {AtomicOperation} from "../../operations/atomicOperations";
import formatByteString from "../formatByteString";
import {Typography} from "../components/typography";
import {GridWrapper} from "../containers/gridWrapper";
import {Grid} from "../components/grid";
import {getReadable} from "../../getAppPath";
import {activeHover, activeHoverButton} from "../styles/activeHover";
import {toolBarButton} from "../styles/toolBarButton";


export interface ToolBarViewState
{
    operations? : Array<AtomicOperation>;
    runningOpText? : string;
    saveText? : string;
}

export class ToolBarView extends React.Component<{},ToolBarViewState>
{
    public state : ToolBarViewState;
    public constructor()
    {
        super(undefined);
        this.state = {

        } as ToolBarViewState;

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
            <div>
                {this.state.saveText ?  (
                    <div>
                        <h1>Saving Project</h1>
                        <Typography>{this.state.saveText}</Typography>
                    </div> 
                ) : (
                    <div>
                        <GridWrapper>
                            <Grid container spacing={1} justify="flex-start">
                                <Grid item>
                                    <img 
                                        src={getReadable("img/input.png")}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={getReadable("img/qc.png")}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                     </Grid>
                                <Grid item>
                                    <img 
                                        src={getReadable("img/align.png")}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                     </Grid>
                                <Grid item>
                                    <img 
                                        src={getReadable("img/output.png")}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                     </Grid>
                                <Grid item>
                                    <img 
                                        src={getReadable("img/genomeBuilder.png")}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                            </Grid>
                        </GridWrapper>
                    </div>
                )}
            </div>
        );
    }
}