import * as React from "react";
import {Chart} from "chart.js";

import { VCF2JSONRow } from '../../../varScanMPileup2SNPVCF2JSON';

export interface RefToVarSNPsDoughnutProps
{
    snps : Array<VCF2JSONRow>;
    height : string;
    width : string;
    marginBottom : string;
}

export class RefToVarSNPsDoughnut extends React.Component<RefToVarSNPsDoughnutProps,{}>
{
    private chartRef = React.createRef<HTMLCanvasElement>();
    private chart : Chart | undefined;

    public colours : Array<string>;

    public constructor(props : RefToVarSNPsDoughnutProps)
    {
        super(props);

        const randomColour = require("randomcolor");

        this.colours = new Array<string>();

        for(let i = 0; i != 16; ++i)
        {
            this.colours.push(randomColour());
        }
    }

    public updateChart()
    {
        if(this.props.snps)
        {
            let data : Array<{label : string;num : number}> = new Array();

            for(let i = 0; i != this.props.snps.length; ++i)
            {
                if(this.props.snps[i].ref && this.props.snps[i].var)
                {
                    let label = `${this.props.snps[i].ref} to ${this.props.snps[i].var}`;
                
                    let item = data.find((x) => {
                        return x.label == label;
                    });

                    if(item)
                    {
                        item.num++;
                    }

                    else 
                        data.push({label : label,num : 1});
            
                    }
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
                                data : data.map((x) => {
                                    return x.num
                                }),
                                backgroundColor : this.colours
                            }
                        ],
                        labels : data.map((x) => {
                            return x.label;
                        })
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
