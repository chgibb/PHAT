import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as React from "react";

import {CircularFigure} from "../../circularFigure/circularFigure";
import {Fasta} from "../../../fasta";
import {SaveKeyEvent} from "../../../ipcEvents";
import {CircularGenome} from "../../containers/circularGenome";

import {GenomeBuilderAppBar} from "./containers/genomeBuilderAppBar";
import {GenomeBuilderOverlays} from "./containers/genomeBuilderOverlays";
import {CircularGenomeEditCache, CircularGenomeEditOpts, CircularGenomeEditAction} from "./editCache/cirularGenomeEditCache";
import {changeName} from "./editCache/changeName";
import {changeContigText} from "./editCache/changeContigText";
import {changeContigBodyColour} from "./editCache/changeContigBodyColour";
import {changeContigTextColour} from "./editCache/changeContigTextColour";
import {changeContigOpacity} from "./editCache/changeContigOpacity";
import {changeContigVadjust} from "./editCache/changeContigVadjust";
import {newCustomContig} from "./editCache/newCustomContig";
import {changeContigStart} from "./editCache/changeContigStart";
import {changeContigEnd} from "./editCache/changeContigEnd";
import {changeRadius} from "./editCache/changeRadius";
import {toggleTrackIntervalLabels} from "./editCache/toggleTrackIntervalLabels";
import {changeIntervalLabelLength} from "./editCache/changeIntervalLabelLength";
import {changeIntervalLabelDirection} from "./editCache/changeIntervalLabelDirection";
import { changeIntervalLabelVadjust } from './editCache/changeIntervalLabelVadjust';
import { AlignData } from '../../../alignData';

export interface CircularGenomeBuilderViewState {
    figureSelectOvelayOpen: boolean;
    editFigureNameOverlayOpen : boolean;
    editContigsOverlayOpen : boolean;
    editBPTrackOptionsOverlayOpen : boolean;
    coverageTrackOverlayOpen : boolean;
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
    aligns : Array<AlignData>;
}

export class CircularGenomeBuilderView extends React.Component<CircularGenomeBuilderViewProps, CircularGenomeBuilderViewState>
{
    public editCaches : {[index : string] : CircularGenomeEditCache | undefined} = {};

    protected changeName = changeName.bind(this);
    protected changeContigText = changeContigText.bind(this);
    protected changeContigBodyColour = changeContigBodyColour.bind(this);
    protected changeContigTextColour = changeContigTextColour.bind(this);
    protected changeContigOpacity = changeContigOpacity.bind(this);
    protected changeContigVadjust = changeContigVadjust.bind(this);
    protected changeContigStart = changeContigStart.bind(this);
    protected changeContigEnd = changeContigEnd.bind(this);
    protected newCustomContig = newCustomContig.bind(this);
    protected changeRadius = changeRadius.bind(this);
    protected toggleTrackIntervalLabels = toggleTrackIntervalLabels.bind(this);
    protected changeIntervalLabelLength = changeIntervalLabelLength.bind(this);
    protected changeIntervalLabelDirection = changeIntervalLabelDirection.bind(this);
    protected changeIntervalLabelVadjust = changeIntervalLabelVadjust.bind(this);
    private GenomeBuilderAppBar = GenomeBuilderAppBar.bind(this);
    private GenomeBuilderOverlays = GenomeBuilderOverlays.bind(this);
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
                <this.GenomeBuilderAppBar figure={figure} />
                <this.GenomeBuilderOverlays figure={figure} />
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