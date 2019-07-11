import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";


import {AtomicOperation} from "../../../operations/atomicOperations";
import formatByteString from "../../formatByteString";
import {Typography} from "../../components/typography";
import {GridWrapper} from "../../containers/gridWrapper";
import {Grid} from "../../components/grid";
import {activeHover, activeHoverButton} from "../../styles/activeHover";
import {toolBarButton} from "../../styles/toolBarButton";
import {Fastq} from "../../../fastq";
import {Fasta} from "../../../fasta";
import {AlignData} from "../../../alignData";
import {InputRendererApp} from "../../inputRenderer/app";
import {PHATView} from "../../phatView";

import {ToolBarTab, ToolBarTabs} from "./containers/toolBarTabs/toolBarTabs";
import {viewImages} from "./viewImages";


export interface ToolBarViewState
{
    views? : Array<ToolBarTab>;
}

export interface ToolBarViewProps
{
    operations? : Array<AtomicOperation>;
    fastqs? : Array<Fastq>;
    fastas? : Array<Fasta>;
    aligns? : Array<AlignData>;
    runningOpText? : string;
    saveText? : string;
}

export class ToolBarView extends React.Component<ToolBarViewProps,ToolBarViewState> implements PHATView
{
    public state : ToolBarViewState;
    public constructor(props : ToolBarViewProps)
    {
        super(props);
        this.state = {
            views : []
        } as ToolBarViewState;
    }

    public render() : JSX.Element
    {
        return (
            <div style={{width:"100%",position:"absolute",left:"0px"}}>
                {this.props.saveText ?  (
                    <div>
                        <h1>Saving Project</h1>
                        <Typography>{this.props.saveText}</Typography>
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
