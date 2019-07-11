import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";


import {AtomicOperation} from "../../../operations/atomicOperations";
import formatByteString from "../../formatByteString";
import {Typography} from "../../components/typography";
import {GridWrapper} from "../../containers/gridWrapper";
import {Grid} from "../../components/grid";
import {getReadable} from "../../../getAppPath";
import {activeHover, activeHoverButton} from "../../styles/activeHover";
import {toolBarButton} from "../../styles/toolBarButton";
import {Tab} from "../../components/tab";
import {Fastq} from "../../../fastq";
import {Fasta} from "../../../fasta";
import {AlignData} from "../../../alignData";
import {InputRendererApp} from "../../inputRenderer/app";
import {Clear} from "../../components/icons/clear";

import {ToolBarTab, ToolBarTabs} from "./containers/toolBarTabs/toolBarTabs";
import {viewImages} from "./viewImages";


export interface ToolBarViewState
{
    operations? : Array<AtomicOperation>;
    runningOpText? : string;
    saveText? : string;
    views? : Array<ToolBarTab>;

    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
}

export class ToolBarView extends React.Component<{},ToolBarViewState>
{
    public state : ToolBarViewState;
    public constructor()
    {
        super(undefined);
        this.state = {
            views : []
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
            <div style={{width:"100%",position:"absolute",left:"0px"}}>
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
                                        src={viewImages["Input"]()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`}
                                        onClick={() => 
                                        {
                                            this.state.views.push({
                                                label : "Input",
                                                imgKey : "Input",
                                                body : (
                                                    <InputRendererApp />
                                                )
                                            });
                                            this.setState({});
                                        }} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={viewImages["QC"]()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={viewImages["Align"]()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={viewImages["Output"]()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={viewImages["Genome Builder"]()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                            </Grid>
                        </GridWrapper>
                        
                        <ToolBarTabs
                            onTabDelete={(tab : ToolBarTab,i : number) => 
                            {
                                this.state.views.splice(i,1); 
                                this.setState({});
                            }}
                            tabs={this.state.views}
                        />
                    </div>
                )}

            </div>
        );
    }
}
