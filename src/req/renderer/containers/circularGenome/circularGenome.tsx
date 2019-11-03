import * as React from "react";

import {CircularFigure, assembleCompilableTemplates, buildBaseFigureTemplate, assembleCompilableCoverageTrack} from "../../circularFigure/circularFigure";
import {Plasmid} from "../../../ngplasmid/lib/plasmid";
import {Node, loadFromString} from "../../../ngplasmid/lib/html";

import {Layer} from "./layer";

export interface CircularGenomeState
{
    plasmidCache : Array<{uuid : string,plasmid : Plasmid}>;
}

export interface CircularGenomeProps
{
    figure : CircularFigure;
    width : number;
    height : number;
    x : number;
    y : number;
}

export class CircularGenome extends React.Component<CircularGenomeProps,CircularGenomeState>
{
    private ref = React.createRef<HTMLDivElement>();
    public constructor(props : CircularGenomeProps)
    {
        super(props);

        this.state = {
            plasmidCache : []
        };

        this.loadPlasmid = this.loadPlasmid.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    public async loadPlasmid(target : string) : Promise<{uuid : string,plasmid : Plasmid} | undefined>
    {
        let scope = {genome : this.props.figure};
        if(target == this.props.figure.uuid)
        {
            console.log("Loading base figure");
            console.log(this.props.figure.name);
            
            let plasmid : Plasmid = new Plasmid();
            plasmid.$scope = scope;

            let nodes : Array<Node> = await loadFromString(
                assembleCompilableTemplates(this.props.figure,
                    buildBaseFigureTemplate(this.props.figure)
                )
            );

            for(let i = 0; i != nodes.length; ++i)
            {
                if(nodes[i].name == "div")
                {
                    for(let k = 0; k != nodes[i].children.length; ++k)
                    {
                        if(nodes[i].children[k].name == "plasmid")
                        {
                            plasmid.fromNode(nodes[i].children[k]);
                            return {
                                uuid : this.props.figure.uuid,
                                plasmid : plasmid
                            };
                        }
                    }
                }
            }
        }

        else
        {
            let coverageTrack = this.props.figure.renderedCoverageTracks.find((x) => x.uuid == target);
            if(coverageTrack)
            {
                console.log("Rendering coverage track "+target);

                let plasmid : Plasmid = new Plasmid();
                plasmid.$scope = scope;

                let nodes : Array<Node> = await loadFromString(assembleCompilableCoverageTrack(this.props.figure,coverageTrack));

                for(let i = 0; i != nodes.length; ++i)
                {
                    if(nodes[i].name == "div")
                    {
                        for(let k = 0; k != nodes[i].children.length; ++k)
                        {
                            if(nodes[i].children[k].name == "plasmid")
                            {
                                plasmid.fromNode(nodes[i].children[k]);
                                this.setState({
                                    plasmidCache : [
                                        ...this.state.plasmidCache,
                                        {
                                            uuid : target,
                                            plasmid : plasmid
                                        }
                                    ]
                                });
                            }
                        }
                    }
                }
            }
        }

        return undefined;
    }

    public updateCanvas()
    {

    }

    public componentDidMount()
    {
        this.updateCanvas();
    }

    public componentDidUpdate(prevProps : Readonly<CircularGenomeProps>,prevState : Readonly<CircularGenomeState>)
    {
        this.updateCanvas();

        if(prevProps.height != this.props.height || prevProps.width != this.props.width || prevProps.x != this.props.x || prevProps.y != this.props.y)
        {
            if(this.ref.current)
            {
                let canvasArr = this.ref.current.getElementsByTagName("canvas");

                for(let i = 0; i != canvasArr.length; ++i)
                {
                    let canvas = canvasArr[i];

                    canvas.style.position = "absolute";
                    canvas.setAttribute("width",`${this.props.width}`);
                    canvas.setAttribute("height",`${this.props.height}`);
                    canvas.style.left = `${this.props.x}px`;
                    canvas.style.top = `${this.props.y}px`;
                }
            }
        }
    }

    public render() : JSX.Element
    {
        return (
            <React.Fragment>
                <div ref={this.ref}>
                {
                    this.props.figure.visibleLayers.map((layer) => 
                    {
                        return (
                            <Layer
                                plasmidCache={this.state.plasmidCache}
                                figure={this.props.figure}
                                target={layer}
                                loadPlasmid={this.loadPlasmid}

                                width={this.props.width}
                                height={this.props.height}
                                x={this.props.x}
                                y={this.props.y}
                            />
                        );
                    })
                }
                </div>
            </React.Fragment>
        );
    }
}