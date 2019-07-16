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
import {InputView} from "../inputView/inputView";
import {PHATView} from "../../phatView";

import {ToolBarTab, ToolBarTabs} from "./containers/toolBarTabs/toolBarTabs";
import {tabInfo} from "./tabInfo";


export interface ToolBarViewState
{
    views? : Array<ToolBarTab<ToolBarViewProps>>;
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
                                        src={tabInfo["Input"].imgURI()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`}
                                        onClick={() => 
                                        {
                                            this.setState({
                                                views : this.state.views.concat([
                                                    {
                                                        label : "Input",
                                                        refKey : "Input",
                                                        body : (props : ToolBarViewProps) => (
                                                            <InputView 
                                                                fastqs={props.fastqs}
                                                                fastas={props.fastas}
                                                                aligns={props.aligns}
                                                                operations={props.operations}
                                                            />
                                                        )
                                                    }
                                                ])
                                            });
                                        }} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={tabInfo["QC"].imgURI()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={tabInfo["Align"].imgURI()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={tabInfo["Output"].imgURI()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                                <Grid item>
                                    <img 
                                        src={tabInfo["Genome Builder"].imgURI()}
                                        className={`${activeHover} ${activeHoverButton} ${toolBarButton}`} 
                                    />
                                </Grid>
                            </Grid>
                        </GridWrapper>
                        
                        <ToolBarTabs
                            onTabDelete={(tab : ToolBarTab<ToolBarViewProps>,i : number) => 
                            {
                                this.state.views.splice(i,1); 
                                this.setState({});
                            }}
                            tabs={this.state.views}
                            propPack={this.props}
                        />
                    </div>
                )}

            </div>
        );
    }
}
