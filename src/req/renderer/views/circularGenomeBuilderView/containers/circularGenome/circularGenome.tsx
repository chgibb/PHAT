import * as React from "react";

import { CircularFigure, getBaseFigureTemplateFromCache, assembleCompilableBaseFigureTemplates } from '../../../../circularFigure/circularFigure';
import { Plasmid } from '../../../../../ngplasmid/lib/plasmid';
import { Layer } from './layer';
import { Node, loadFromString } from '../../../../../ngplasmid/lib/html';

export interface CircularGenomeState
{
    plasmidCache : Array<{uuid : string,plasmid : Plasmid}>;
}

export interface CircularGenomeProps
{
    figure : CircularFigure;
}

export class CircularGenome extends React.Component<CircularGenomeProps,CircularGenomeState>
{
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

    public async loadPlasmid(target : string) : Promise<void>
    {
        let scope = {genome : this.props.figure};
        if(target == this.props.figure.uuid)
        {
            console.log("Loading base figure");
            
            let plasmid : Plasmid = new Plasmid();
            plasmid.$scope = scope;

            let nodes : Array<Node> = await loadFromString(assembleCompilableBaseFigureTemplates(this.props.figure));

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
                                        uuid : this.props.figure.uuid,
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

    public updateCanvas()
    {

    }

    public componentDidMount()
    {
        this.updateCanvas();
    }

    public componentDidUpdate()
    {
        this.updateCanvas();
    }

    public render() : JSX.Element
    {
        return (
            <React.Fragment>
                {
                    this.props.figure.visibleLayers.map((layer) => {
                        return (
                            <Layer
                                plasmidCache={this.state.plasmidCache}
                                figure={this.props.figure}
                                target={layer}
                                loadPlasmid={this.loadPlasmid}
                            />
                        );
                    })
                }
            </React.Fragment>
        );
    }
}