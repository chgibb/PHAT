import * as React from "react";
import {Component} from "react";

import {Fastq} from "./../../fastq";
import {inputFastqDialog} from "./inputFastqDialog";
import {activeHover,activeHoverButton} from "./../styles/activeHover";
import {getReadable}  from './../../getAppPath';
import {fullWidth} from './../styles/fullWidth';

export interface FastqViewProps
{
    fastqInputs : Array<Fastq>
}

export class FastqView extends Component<FastqViewProps,{}>
{
    public constructor(fastqInputs : Array<Fastq>)
    {
        super({
            fastqInputs : fastqInputs
        });
    }

    public render()
    {
        return (
            <div>
                <img 
                    className={`${activeHover} ${activeHoverButton}`} 
                    src={getReadable("img/browseButton.png")}
                    onClick={() => {
                        inputFastqDialog();
                    }}
                />
                <div className={fullWidth}>
                    <table className={fullWidth}>
                        <tr>
                            <th>Sample Name</th>
                            <th>Path</th>
                            <th>Size</th>
                        </tr>
                        {this.props.fastqInputs ? this.props.fastqInputs.map((val : Fastq,i : number) => {
                            return (
                                <tr className={activeHover}>
                                    <td>{val.alias}</td>
                                    <td></td>
                                    <td>{val.sizeString}</td>
                                </tr>
                            )
                        }) : undefined}
                    </table>
                </div>
            </div>
        );
    }
}
