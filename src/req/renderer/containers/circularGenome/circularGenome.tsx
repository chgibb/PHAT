import * as React from "react";

import { CircularFigure, renderSVGToCanvas, CoverageTrackLayer, SNPTrackLayer, MapScope } from "../../circularFigure/circularFigure";
import { PlasmidCacheMgr } from './cachedPlasmid';

export interface CircularGenomeState {

}

export interface CircularGenomeProps {
    shouldUpateCanvas: boolean | undefined;
    figure: CircularFigure;
    width: number;
    height: number;
    x: number;
    y: number;
}

export class CircularGenome extends React.Component<CircularGenomeProps, CircularGenomeState>
{
    private ref = React.createRef<HTMLDivElement>();
    private plasmidCache : PlasmidCacheMgr = new PlasmidCacheMgr();
    public constructor(props: CircularGenomeProps) {
        super(props);

        this.state = {

        };

        this.updateCanvas = this.updateCanvas.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    public async updateCanvas() {
        for (let i = 0; i != this.props.figure.visibleLayers.length; ++i) {
            let layer = this.props.figure.visibleLayers[i];
            if (this.ref.current) {
                let canvasArr = this.ref.current.getElementsByTagName("canvas");

                let canvas = canvasArr[i];

                let cachedPlasmid = this.plasmidCache.findPlasmidInCache(layer, this.props.figure);

                let layerType: CoverageTrackLayer | SNPTrackLayer | undefined;

                layerType = this.props.figure.renderedSNPTracks.find((x) => x.uuid == layer);

                if (!layerType) {
                    layerType = this.props.figure.renderedCoverageTracks.find((x) => x.uuid == layer);
                }

                let hasScopeChanged = false;
                let oldScope: MapScope | undefined;

                if (layerType && cachedPlasmid) {
                    oldScope = JSON.parse(cachedPlasmid.oldStrScope);
                    if (oldScope && oldScope.genome) {
                        switch (layerType.type) {
                            case "coverageTrackLayer":

                                console.log(`${oldScope.genome!.radius} ${this.props.figure.radius}`);
                                if (oldScope.genome.radius != this.props.figure.radius) {
                                    hasScopeChanged = true;
                                    break;
                                }
                                break;
                        }

                        if (oldScope.genome.visibleLayers.length != this.props.figure.visibleLayers.length) {
                            console.log("visible layers changed");
                            hasScopeChanged = true;
                        }
                    }


                } else {
                    hasScopeChanged = true;
                }

                if (hasScopeChanged || !cachedPlasmid) {
                    cachedPlasmid = await this.plasmidCache.loadPlasmidCacheEntry(layer, this.props.figure);

                    if (cachedPlasmid && cachedPlasmid.plasmid && canvas) {
                        let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

                        if (ctx) {
                            canvas.style.position = "absolute";
                            canvas.setAttribute("width", `${this.props.width}`);
                            canvas.setAttribute("height", `${this.props.height}`);
                            canvas.style.left = `${this.props.x}px`;
                            canvas.style.top = `${this.props.y}px`;

                            ctx.clearRect(0, 0, this.props.width, this.props.height);

                            let scope = { genome: this.props.figure };
                            cachedPlasmid.plasmid.$scope = scope;

                            this.plasmidCache.setOldScope(cachedPlasmid.uuid,this.props.figure);

                            await renderSVGToCanvas(cachedPlasmid.plasmid.renderStart() + cachedPlasmid.plasmid.renderEnd(), ctx);
                            console.log(`Drew ${layer}`);
                        }
                    }
                }
            }
        }
    }

    public componentDidMount() {
        this.updateCanvas();
    }

    public shouldComponentUpdate(prevProps: Readonly<CircularGenomeProps>, prevState: Readonly<CircularGenomeState>): boolean {
        return true;
    }

    public async componentDidUpdate(prevProps: Readonly<CircularGenomeProps>, prevState: Readonly<CircularGenomeState>) {
        let shouldUpdateCanvasDueToResize = false;

        this.plasmidCache.prunePlasmidCache(this.props.figure);

        if (this.ref.current) {
            let canvasArr = this.ref.current.getElementsByTagName("canvas");

            while (canvasArr.length < this.props.figure.visibleLayers.length) {
                this.ref.current.appendChild(document.createElement("canvas"));
            }

            while (canvasArr.length > this.props.figure.visibleLayers.length) {
                if (this.ref.current.lastChild) {
                    this.ref.current.lastChild.remove();
                }
                canvasArr = this.ref.current.getElementsByTagName("canvas");
            }

            canvasArr = this.ref.current.getElementsByTagName("canvas");

            for (let i = 0; i != canvasArr.length; ++i) {
                let canvas = canvasArr[i];

                canvas.style.position = "absolute";

                if (prevProps.width != this.props.width || canvas.width != this.props.width) {
                    shouldUpdateCanvasDueToResize = true;
                    canvas.setAttribute("width", `${this.props.width}`);
                }

                if (prevProps.height != this.props.height || canvas.height != this.props.height) {
                    shouldUpdateCanvasDueToResize = true;
                    canvas.setAttribute("height", `${this.props.height}`);
                }

                if (prevProps.x != this.props.x || canvas.style.left != `${this.props.x}px`)
                    canvas.style.left = `${this.props.x}px`;

                if (prevProps.y != this.props.y || canvas.style.top != `${this.props.y}px`)
                    canvas.style.top = `${this.props.y}px`;
            }
            if (this.props.shouldUpateCanvas) {
                shouldUpdateCanvasDueToResize = true;
            }

            if (shouldUpdateCanvasDueToResize || this.props.shouldUpateCanvas) {
                await this.updateCanvas();
            }
        }



    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <div ref={this.ref} key={this.props.figure.uuid}>

                </div>
            </React.Fragment>
        );
    }
}