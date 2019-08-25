import * as React from "react";

import {CircularFigure, renderSVGToCanvas} from "../../../../circularFigure/circularFigure";
import {Plasmid} from "../../../../../ngplasmid/lib/plasmid";

export interface LayerProps {
    plasmidCache: Array<{ uuid: string, plasmid: Plasmid }>;
    figure: CircularFigure;
    target: string;
    loadPlasmid: (target: string) => void;
    width : number;
    height : number;
    x : number;
    y : number;
}

export class Layer extends React.Component<LayerProps, {}>
{
    private canvasRef = React.createRef<HTMLDivElement>();
    private canvas = document.createElement("canvas");
    public constructor(props: LayerProps) 
    {
        super(props);

        this.updateCanvas = this.updateCanvas.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }


    public async updateCanvas() 
    {
        let plasmid = this.props.plasmidCache.find((x) => 
        {
            if (x.uuid == this.props.target)
                return true;
            return false;
        });

        if (!plasmid) 
        {
            this.props.loadPlasmid(this.props.target);
        }

        else if (plasmid && this.canvas) 
        {
            let ctx: CanvasRenderingContext2D | null = this.canvas.getContext("2d");

            if (ctx) 
            {
                this.canvas.style.position = "absolute";
                this.canvas.setAttribute("width",`${this.props.width}`);
                this.canvas.setAttribute("height",`${this.props.height}`);
                this.canvas.style.left = `${this.props.x}px`;
                this.canvas.style.top = `${this.props.y}px`;
                
                await renderSVGToCanvas(plasmid.plasmid.renderStart() + plasmid.plasmid.renderEnd(), ctx);
            }
        }
    }

    public componentDidMount() 
    {
        if(this.canvasRef.current)
        {
            this.canvasRef.current.appendChild(this.canvas);
            this.updateCanvas();
        }
    }

    public componentDidUpdate() 
    {
        this.updateCanvas();
    }

    public shouldComponentUpdate() : boolean
    {
        if(this.canvasRef.current)
        {
            this.updateCanvas();
            return false;
        }
        return true;
    }

    public render(): JSX.Element 
    {
        console.log("render layer");
        return (
            <React.Fragment>
                <div ref={this.canvasRef}>
                    
                </div>
            </React.Fragment>
        );
    }
}