import * as React from "react";

import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {AppBar} from "../../../components/appBar";
import {Toolbar} from "../../../components/toolBar";
import {white} from "../../../styles/colours";
import {IconButton} from "../../../components/iconButton";
import {Tooltip} from "../../../components/tooltip";
import {DonutLargeOutlined} from "../../../components/icons/donutLargeOutlined";
import {WavesOutlined} from "../../../components/icons/wavesOutlined";
import {SwapVertOutlined} from "../../../components/icons/swapVertOutlined";
import {Typography} from "../../../components/typography";
import {MenuRounded} from "../../../components/icons/menuRounded";

import {appBar} from "./styles/appBar";

export function GenomeBuilderAppBar(this: CircularGenomeBuilderView, props: { figure: CircularFigure | undefined }): JSX.Element 
{
    let figure = props.figure;
    return (
        <AppBar position="fixed" className={appBar}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="primary"
                    classes={{colorPrimary: white}}
                    onClick={() => 
                    {
                        this.setState({
                            figureSelectOvelayOpen: !this.state.figureSelectOvelayOpen
                        });
                    }}
                >
                    <MenuRounded />
                </IconButton>
                <Tooltip title="Change Figure Name">
                    <IconButton
                        edge="start"
                        color="primary"
                        classes={{colorPrimary: white}}
                        onClick={() => 
                        {
                            this.setState({
                                editFigureNameOverlayOpen: true
                            });
                        }}
                    >
                        <Typography>
                            {figure ? figure.name : ""}
                        </Typography>
                    </IconButton>
                </Tooltip>
                <div style={{
                    marginLeft: "auto"
                }}>
                    <Tooltip title="Undo">
                        <IconButton
                            onClick={() => 
                            {
                                if (figure) 
                                {
                                    const oldEdit = this.maybePopEdit(figure);

                                    if (oldEdit) 
                                    {
                                        oldEdit.rollback(figure, JSON.parse(oldEdit.figureStr));
                                        this.saveFigures();
                                    }
                                }
                            }}
                        >
                            <Typography style={{color:"white"}}>Undo</Typography>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Customize Contigs">
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{colorPrimary: white}}
                            onClick={()=>
                            {
                                this.setState({
                                    editContigsOverlayOpen : true
                                });
                            }}
                        >
                            <DonutLargeOutlined
                                style={{
                                    transform: "rotate(45deg)"
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Coverage Visualization">
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{colorPrimary: white}}
                            onClick={()=>
                            {
                                this.setState({
                                    coverageTrackOverlayOpen : true
                                });
                            }}
                        >
                            <WavesOutlined
                                style={{
                                    transform: "rotate(45deg)"
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Change Radius">
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{colorPrimary: white}}
                            onClick={()=>
                            {
                                this.setState({
                                    editBPTrackOptionsOverlayOpen : true
                                });
                            }}
                        >
                            <SwapVertOutlined
                                style={{
                                    transform: "rotate(-30deg)"
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
}
