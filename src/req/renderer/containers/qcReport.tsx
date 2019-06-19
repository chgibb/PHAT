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
    private innerRefCB : (ref : HTMLDivElement | undefined) => void;
    public constructor(props : QCReportProps)
    {
        super(props);

        this.innerRefCB = (ref : HTMLDivElement | undefined) => 
        {
            if(ref)
            {
                let fastq = getReferenceFromUuid<Fastq>(this.props.fastqs,this.props.viewingFastq);

                ref.innerHTML = fs.readFileSync(getQCReportHTML(fastq)).toString();
            }
        };
    }

    public render() : JSX.Element
    {
        return (
            <div>
                <Button
                    onClick={() => 
                    {
                        this.props.onGoBackClick();
                    }}
                    label="Go Back"
                />
                <div ref={this.innerRefCB} />
            </div>
        );
    }
}
