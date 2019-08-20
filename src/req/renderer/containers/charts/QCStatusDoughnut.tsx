import * as React from "react";
import { Chart } from "chart.js";

import { Fastq } from '../../../fastq';

export interface QCStatusDoughnutProps {
    fastqs: Array<Fastq>;
    height: string;
    width: string;
    marginBottom: string;
}

export class QCStatusDoughnut extends React.Component<QCStatusDoughnutProps, {}>
{
    private chartRef = React.createRef<HTMLCanvasElement>();
    private chart: Chart | undefined;

    public colour1: string;
    public colour2: string;
    public colour3: string;
    public colour4: string;

    public constructor(props: QCStatusDoughnutProps) {
        super(props);

        const randomColour = require("randomcolor");

        this.colour1 = randomColour();
        this.colour2 = randomColour();
        this.colour3 = randomColour();
        this.colour4 = randomColour();
    }

    public updateChart() {
        let numPass = 0;
        let numWarn = 0;
        let numFail = 0;
        let numNoData = 0;

        if (this.props.fastqs) {
            for (let i = 0; i != this.props.fastqs.length; ++i) {

                if (this.props.fastqs[i].QCData.summary && this.props.fastqs[i].QCData.summary.length > 0) {
                    for (let j = 0; j != this.props.fastqs[i].QCData.summary.length; ++j) {
                        let status = this.props.fastqs[i].QCData.summary[j].status;
                        console.log(status);
                        if (status == "pass")
                            numPass++;
                        else if (status == "warn")
                            numWarn++;
                        else if (status == "fail")
                            numFail++;
                        else if (status == "No Data")
                            numNoData++;
                        else if (status === undefined)
                            numNoData++;
                    }
                }
                else
                    numNoData += 5;
            }

            if (this.chartRef.current) {
                if (!this.chart) {
                    this.chart = new Chart(this.chartRef.current.getContext("2d")!, {
                        type: "doughnut",
                        options: {
                            animation: {
                                animateRotate: true
                            }
                        }
                    });
                }

                let data = {
                    datasets: [
                        {
                            data: [numPass, numWarn, numFail, numNoData],
                            backgroundColor: [
                                this.colour1,
                                this.colour2,
                                this.colour3,
                                this.colour4
                            ]
                        }
                    ],
                    labels: [
                        "Pass",
                        "Warning",
                        "Failure",
                        "No Data"
                    ]
                };

                console.log(data);
                this.chart.data = data;
                this.chart.update();
            }
        }
    }

    public componentDidUpdate() {
        this.updateChart();
    }

    public componentDidMount() {
        this.updateChart();
    }

    public render(): JSX.Element {
        return (
            <div style={{
                position: "relative",
                height: this.props.height,
                width: this.props.width,
                marginBottom: this.props.marginBottom
            }}>
                <canvas ref={this.chartRef}></canvas>
            </div>
        );
    }
}