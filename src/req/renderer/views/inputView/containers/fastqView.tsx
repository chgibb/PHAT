import * as React from "react";

import {FastqTable} from "../../../containers/tables/fastqTable";
import {Button} from "../../../components/button";
import {Fastq} from "../../../../fastq";
import * as pub from "../publish";

import {inputFastqDialog} from "./inputFastqDialog";


export interface FastqViewProps
{
    fastqInputs : Array<Fastq>
}

export class FastqView extends React.Component<FastqViewProps,{}>
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
                    type="remain"
                    onClick={() => 
                    {
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
                            type="remain"
                            onClick={() => 
                            {
                                pub.importSelectedFastqs(this.props.fastqInputs);
                            }}
                            label="Import All"
                        /> : "" : ""
                }
            </React.Fragment>
        );
    }
}

