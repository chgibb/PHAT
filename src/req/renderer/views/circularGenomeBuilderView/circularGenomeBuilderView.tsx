import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as React from "react";

import {AppBar} from "../../components/appBar";
import {Toolbar} from "../../components/toolBar";
import {IconButton} from "../../components/iconButton";
import {MenuRounded} from "../../components/icons/menuRounded";
import {white} from "../../styles/colours";
import {CircularFigure} from "../../circularFigure/circularFigure";
import {Fasta} from "../../../fasta";
import {SaveKeyEvent} from "../../../ipcEvents";
import {DonutLargeOutlined} from "../../components/icons/donutLargeOutlined";
import {WavesOutlined} from "../../components/icons/wavesOutlined";
import {SwapVertOutlined} from "../../components/icons/swapVertOutlined";
import {Typography} from "../../components/typography";
import {Tooltip} from "../../components/tooltip";

import {CircularGenome} from "../../containers/circularGenome";
import {FigureSelectOverlay} from "./containers/overlays/figureSelectOverlay";
import {appBar} from "./containers/styles/appBar";
import {EditFigureNameOverlay} from "./containers/overlays/editFigureName";
import { CircularGenomeEditCache, CircularGenomeEditOpts, CircularGenomeEditAction } from './editCache/cirularGenomeEditCache';

export interface CircularGenomeBuilderViewState {
    figureSelectOvelayOpen: boolean;
    editFigureNameOverlayOpen : boolean;
    selectedFigure: string;
    figurePosition : {
        width : number,
        height : number,
        x : number,
        y : number
    }
}

export interface CircularGenomeBuilderViewProps {
    figures: Array<CircularFigure>;
    fastas: Array<Fasta>;
}

export class CircularGenomeBuilderView extends React.Component<CircularGenomeBuilderViewProps, CircularGenomeBuilderViewState>
{
    public editCaches : {[index : string] : CircularGenomeEditCache | undefined} = {};
    public constructor(props: CircularGenomeBuilderViewProps) 
    {
        super(props);

        this.state = {
            figureSelectOvelayOpen: false,
            figurePosition : {
                width : 0,
                height : 0,
                x : 0,
                y : 0
            }
        } as CircularGenomeBuilderViewState;

        this.reposition = this.reposition.bind(this);

        window.addEventListener("resize",this.reposition);
    }

    public maybePushEdit(figure : CircularFigure,opts : CircularGenomeEditOpts) : void
    {
        let cache = this.editCaches[figure.uuid];
        
        if(cache)
            cache.pushEdit(figure,opts);
    }

    public maybePopEdit(figure : CircularFigure) : CircularGenomeEditAction | undefined
    {
        let cache = this.editCaches[figure.uuid];
        
        if(cache)
            return cache.popEdit(figure);
        return undefined;
    }

    public newFigure(fasta: Fasta): void 
    {
        if(fasta.indexedForVisualization)
        {
            ipc.send(
                "saveKey",
            {
                action: "saveKey",
                channel: "circularGenomeBuilder",
                key: "circularFigures",
                val: [...this.props.figures, new CircularFigure("New Figure", fasta.uuid, fasta.contigs)]
            } as SaveKeyEvent
            );
        }
    }

    public saveFigures() : void
    {
        ipc.send(
            "saveKey",
            {
                action: "saveKey",
                channel: "circularGenomeBuilder",
                key: "circularFigures",
                val: this.props.figures
            }
        );
    }

    public reposition()
    {
        this.props.figures.map((x) => 
        {
            if (x.uuid == this.state.selectedFigure) 
            {
                this.setState({
                    figurePosition: {
                        width : x.width,
                        height : x.height,
                        x : (document.documentElement.clientWidth/2) - (x.width/2),
                        y : (document.documentElement.clientHeight/2) - (x.height/2)
                    }
                });
            }
        }
        );
    }

    public componentDidUpdate(prevProps : Readonly<CircularGenomeBuilderViewProps>,prevState : Readonly<CircularGenomeBuilderViewState>)
    {
        if(prevState.selectedFigure != this.state.selectedFigure)
        {
            this.reposition();
        }
    }

    public shouldComponentUpdate()
    {
        return true;
    }

    public componentWillUnmount()
    {
        window.removeEventListener("resize",this.reposition);
    }

    public render(): JSX.Element 
    {
        let figure : CircularFigure | undefined = this.props.figures.find((x) => 
        {
            if (x.uuid == this.state.selectedFigure) 
            {
                return true;
            }
            return false;
        });

        if(figure)
        {
            if(!this.editCaches[figure.uuid])
                this.editCaches[figure.uuid] = new CircularGenomeEditCache();
        }

        return (
            <React.Fragment>
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
                                onClick={()=>
                                {
                                    this.setState({
                                        editFigureNameOverlayOpen : true
                                    });
                                }}
                            >
                                <Typography>
                                    {figure ? figure.name : ""}
                                </Typography>
                            </IconButton>
                        </Tooltip>
                        <div style={{
                            marginLeft:"auto"
                        }}>
                            <Tooltip title="Undo">
                                <IconButton
                                    onClick={()=>{
                                        if(figure)
                                        {
                                            const oldEdit = this.maybePopEdit(figure);

                                            if(oldEdit)
                                            {
                                                oldEdit.rollback(figure,JSON.parse(oldEdit.figureStr));
                                                this.saveFigures();
                                            }
                                        }
                                    }}
                                >
                                    <Typography>Undo</Typography>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Customize Contigs">
                                <IconButton
                                    edge="start"
                                    color="primary"
                                    classes={{colorPrimary: white}}
                                >
                                    <DonutLargeOutlined 
                                        style={{
                                            transform:"rotate(45deg)"
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Coverage Visualization">
                                <IconButton
                                    edge="start"
                                    color="primary"
                                    classes={{colorPrimary: white}}
                                >
                                    <WavesOutlined 
                                        style={{
                                            transform:"rotate(45deg)"
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Change Radius">
                                <IconButton
                                    edge="start"
                                    color="primary"
                                    classes={{colorPrimary: white}}
                                >
                                    <SwapVertOutlined 
                                        style={{
                                            transform:"rotate(-30deg)"
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Toolbar>
                </AppBar>
                {
                    figure ?
                        <React.Fragment>
                            <EditFigureNameOverlay
                                value={figure.name}
                                open={this.state.editFigureNameOverlayOpen}
                                onSave={(value) => 
                                {
                                    if(value && figure)
                                    {
                                        this.maybePushEdit(
                                            figure,{
                                                description : `Change name from ${figure.name} to ${value}`,
                                                commit : (figure : CircularFigure) => {
                                                    figure.name = value;
                                                },
                                                afterCommit : () => {
                                                    this.saveFigures();
                                                },
                                                rollback : (newFigure : CircularFigure,oldFigure : CircularFigure) => {
                                                    newFigure.name = oldFigure.name;
                                                }
                                            }
                                        );
                                        
                                    }
                                }}
                                onClose={()=>
                                {
                                    this.setState({
                                        editFigureNameOverlayOpen : false
                                    });
                                }}
                            />
                        </React.Fragment> : null
                }
                <FigureSelectOverlay 
                    builder={this}
                    open={this.state.figureSelectOvelayOpen}
                    onClose={ () => 
                    {
                        this.setState({
                            figureSelectOvelayOpen: false
                        });
                    }}
                />
                {
                    figure ? (
                        <CircularGenome
                            figure={figure}
                            width={this.state.figurePosition.width}
                            height={this.state.figurePosition.height}
                            x={this.state.figurePosition.x}
                            y={this.state.figurePosition.y}
                        />
                    ) : ""
                }
            </React.Fragment>
        );
    }
}