import * as fs from "fs";

import * as React from "react";

import {Fastq} from "../../fastq";
import {getReferenceFromUuid} from "../../uniquelyAddressable";
import {getQCReportHTML} from "../../QCData";
import {Button} from "../components/button";

export interface QCReportProps
{
    fastqs : Array<Fastq>;
    viewingFastq : string;
    onGoBackClick : () => void;
}

export class QCReport extends React.Component<QCReportProps,{}>
{
    private ref = React.createRef<HTMLDivElement>();
    public constructor(props : QCReportProps)
    {
        super(props);
    }

    public componentDidMount() : void
    {
        if(this.ref.current)
        {
            let fastq = getReferenceFromUuid<Fastq>(this.props.fastqs,this.props.viewingFastq);

            this.ref.current.innerHTML = fs.readFileSync(getQCReportHTML(fastq)).toString();
        }
    }

    public render() : JSX.Element
    {
        return (
            <div>
                <Button
                    type="retreat"
                    onClick={() => 
                    {
                        this.props.onGoBackClick();
                    }}
                    label="Go Back"
                />
                <div ref={this.ref} />
            </div>
        );
    }
}
