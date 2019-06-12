import * as React from "react";
import {Component} from "react";

import * as pub from "./publish";
import {FastqTable} from "../containers/fastqTable";
import {Fastq} from "./../../fastq";
import {inputFastqDialog} from "./inputFastqDialog";
import {Button} from '../components/button';

export interface FastqViewProps
{
    fastqInputs : Array<Fastq>
}

export class FastqView extends Component<FastqViewProps,{}>
{
    public constructor(props : FastqViewProps)
    {
        super(props);
    }

    public render()
    {
        return (
            <React.Fragment>
                <Button 
                    onClick={() => {
                        inputFastqDialog();
                    }}
                    label="Browse"
                />
                <FastqTable
                    data={this.props.fastqInputs}
                />
                {
                    this.props.fastqInputs ? this.props.fastqInputs.length > 0 ?
                    <Button
                        onClick={() => {
                            pub.importSelectedFastqs(this.props.fastqInputs);
                        }}
                        label="Import All"
                    /> : "" : ""
                }
            </React.Fragment>
        );
    }
}

