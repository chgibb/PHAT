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

import {CircularGenome} from "./containers/circularGenome/circularGenome";
import {FigureSelectOverlay} from "./containers/overlays/figureSelectOverlay";
import {appBar} from "./containers/styles/appBar";
import { SwapVertOutlined } from '../../components/icons/swapVertOutlined';
import { Typography } from '../../components/typography';


export interface CircularGenomeBuilderViewState {
    figureSelectOvelayOpen: boolean;
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

    public newFigure(fasta: Fasta): void 
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
                            })
                        }
                    }
                );
    }

    public componentDidUpdate(prevProps : CircularGenomeBuilderViewProps,prevState : CircularGenomeBuilderViewState)
    {
        if(prevState.selectedFigure != this.state.selectedFigure)
        {
            this.reposition();
        }
    }

    public componentWillUnmount()
    {
        window.removeEventListener("resize",this.reposition);
    }

    public render(): JSX.Element 
    {
        const figure : CircularFigure | undefined = this.props.figures.find((x) => 
        {
            if (x.uuid == this.state.selectedFigure) 
            {
                return true;
            }
            return false;
        });

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
                        <Typography
                        style={{
                            cursor:"pointer"
                        }}>
                            {figure ? figure.name : ""}
                        </Typography>
                        <div style={{
                            marginLeft:"auto"
                        }}>
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
                        </div>
                    </Toolbar>
                </AppBar>
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