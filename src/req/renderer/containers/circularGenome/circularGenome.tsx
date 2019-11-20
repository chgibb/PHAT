import * as React from "react";

import {CircularFigure, renderSVGToCanvas} from "../../circularFigure/circularFigure";
import {Plasmid} from "../../../ngplasmid/lib/plasmid";
import { loadPlasmid } from './cachedPlasmid';

export interface CircularGenomeState
{
    
}

export interface CircularGenomeProps
{
    shouldUpateCanvas : boolean | undefined;
    figure : CircularFigure;
    width : number;
    height : number;
    x : number;
    y : number;
}

export class CircularGenome extends React.Component<CircularGenomeProps,CircularGenomeState>
{
    private ref = React.createRef<HTMLDivElement>();
    private plasmidCache : Array<{uuid : string,plasmid : Plasmid}>;
    public constructor(props : CircularGenomeProps)
    {
        super(props);

        this.state = {

        };

        this.plasmidCache = [];

        this.updateCanvas = this.updateCanvas.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    public async updateCanvas() 
    {
        for (let i = 0; i != this.props.figure.visibleLayers.length; ++i) 
        {
            let layer = this.props.figure.visibleLayers[i];
            if (this.ref.current) 
            {
                let canvasArr = this.ref.current.getElementsByTagName("canvas");

                while (canvasArr.length < this.props.figure.visibleLayers.length) 
                {
                    this.ref.current.appendChild(document.createElement("canvas"));
                }

                canvasArr = this.ref.current.getElementsByTagName("canvas");

                let canvas = canvasArr[i];

                let plasmid = this.plasmidCache.find((x) => 
                {
                    if (x.uuid == layer)
                        return true;
                    return false;
                });

                if (!plasmid) 
                {
                    plasmid = await loadPlasmid(layer,this.props.figure);
                }

                if (plasmid && canvas) 
                {
                    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

                    if (ctx) 
                    {
                        canvas.style.position = "absolute";
                        canvas.setAttribute("width", `${this.props.width}`);
                        canvas.setAttribute("height", `${this.props.height}`);
                        canvas.style.left = `${this.props.x}px`;
                        canvas.style.top = `${this.props.y}px`;

                        ctx.clearRect(0, 0, this.props.width, this.props.height);

                        let scope = {genome: this.props.figure};
                        plasmid.plasmid.$scope = scope;

                        await renderSVGToCanvas(plasmid.plasmid.renderStart() + plasmid.plasmid.renderEnd(), ctx);
                    }
                }
            }
        }
    }

    public componentDidMount()
    {
        this.updateCanvas();
    }

    public shouldComponentUpdate(prevProps : Readonly<CircularGenomeProps>,prevState : Readonly<CircularGenomeState>) : boolean
    {
        return true;
    }

    public async componentDidUpdate(prevProps : Readonly<CircularGenomeProps>,prevState : Readonly<CircularGenomeState>)
    {
        let shouldUpdateCanvasDueToResize = false;
        
        if(this.ref.current)
        {
            let canvasArr = this.ref.current.getElementsByTagName("canvas");

            for(let i = 0; i != canvasArr.length; ++i)
            {
                let canvas = canvasArr[i];

                canvas.style.position = "absolute";

                if(prevProps.width != this.props.width)
                {
                    shouldUpdateCanvasDueToResize = true;
                    canvas.setAttribute("width",`${this.props.width}`);
                }

                if(prevProps.height != this.props.height)    
                {
                    shouldUpdateCanvasDueToResize = true;
                    canvas.setAttribute("height",`${this.props.height}`);
                }

                if(prevProps.x != this.props.x)
                    canvas.style.left = `${this.props.x}px`;

                if(prevProps.y != this.props.y)
                    canvas.style.top = `${this.props.y}px`;
            }
            if(this.props.shouldUpateCanvas)
        {
            shouldUpdateCanvasDueToResize = true;

            while(canvasArr.length > this.props.figure.visibleLayers.length){
                if(this.ref.current.lastChild){
                    this.ref.current.lastChild.remove();
                }
                canvasArr = this.ref.current.getElementsByTagName("canvas");
            }
        }

        if(shouldUpdateCanvasDueToResize || this.props.shouldUpateCanvas)
        {
            await this.updateCanvas();
        }
        }

        
        
    }

    public render() : JSX.Element
    {
        return (
            <React.Fragment>
                <div ref={this.ref}>

                </div>
            </React.Fragment>
        );
    }
}