import * as React from "react";
import {Chart} from "chart.js";

import {AlignData} from "../../../alignData";

export interface AlignerDoughnutProps
{
    aligns : Array<AlignData>;
    height : string;
    width : string;
    marginBottom : string;
}

export class AlignerDoughnut extends React.Component<AlignerDoughnutProps,{}>
{
    private chartRef = React.createRef<HTMLCanvasElement>();
    private chart : Chart | undefined;

    public colour1 : string;
    public colour2 : string;
    public colour3 : string;

    public constructor(props : AlignerDoughnutProps)
    {
        super(props);

        const randomColour = require("randomcolor");

        this.colour1 = randomColour();
        this.colour2 = randomColour();
        this.colour3 = randomColour();
    }

    public updateChart()
    {
        let numBowtie2 = 0;
        let numHisat2 = 0;
        let numUnknown = 0;

        if(this.props.aligns)
        {
            for(let i = 0; i != this.props.aligns.length; ++i)
            {
                if(this.props.aligns[i].alignerUsed == "bowtie2")
                    numBowtie2++;
                else if(this.props.aligns[i].alignerUsed == "hisat2")
                    numHisat2++;
                else
                    numUnknown++;
            }
            if(this.chartRef.current)
            {
                if(this.chart)
                    this.chart.destroy();

                this.chart = new Chart(this.chartRef.current.getContext("2d")!,{
                    type: "doughnut",
                    data : {
                        datasets: [
                            {
                                data : [numBowtie2,numHisat2,numUnknown],
                                backgroundColor : [
                                    this.colour1,
                                    this.colour2,
                                    this.colour3
                                ]
                            }
                        ],
                        labels : [
                            "Bowtie2",
                            "Hisat2",
                            "Unknown"
                        ]
                    },
                    options : {
                        animation : {
                            animateRotate : true
                        }
                    }
                });
            }
        }
    }

    public componentDidUpdate()
    {
        this.updateChart();
    }

    public componentDidMount()
    {
        this.updateChart();
    }

    public render() : JSX.Element
    {
        return (
            <div style={{
                position : "relative",
                height : this.props.height,
                width : this.props.width,
                marginBottom : this.props.marginBottom
            }}>
                <canvas ref={this.chartRef}></canvas>
            </div>
        );
    }
}
