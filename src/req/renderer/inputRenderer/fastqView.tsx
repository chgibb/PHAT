import * as React from "react";
import {Component} from "react";

import * as pub from "./publish";
import {MaterialTable} from "./../../components/materialTable";
import {Fastq} from "./../../fastq";
import {inputFastqDialog} from "./inputFastqDialog";
import {activeHover,activeHoverButton} from "./../styles/activeHover";
import {selected} from "./../styles/selected";
import {getReadable}  from './../../getAppPath';
import {fullWidth} from './../styles/fullWidth';
import {threeQuartersLoader} from "./../styles/threeQuartersLoader";
import { tableIcons } from '../../components/tableIcons';

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
            <MaterialTable
                title=""
                columns={[
                    {
                        title: "Sample Name",
                        field: "alias"
                    },
                    {
                        title: "Path",
                        field: "path"
                    },
                    {
                        title: "Size",
                        field: "sizeString"
                    }
                ]}
                data={this.props.fastqInputs}
                icons={tableIcons}
            />
        );
        /*return (
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
                        <tbody>
                            <tr>
                                <th>Sample Name</th>
                                <th>Path</th>
                                <th>Size</th>
                            </tr>
                            {this.props.fastqInputs ? this.props.fastqInputs.map((val : Fastq,i : number) => {
                                return (
                                    <tr 
                                        key={val.uuid}
                                        className={`${activeHover} ${val.checked ? selected : ""}`}
                                        onClick={(event : React.MouseEvent<HTMLTableRowElement,MouseEvent>) => {
                                            event.persist();
                                            
                                            let target = event.target as HTMLTableCellElement;

                                            if(target.classList.contains(`${val.uuid}Class`))
                                            {
                                                val.checked = !val.checked;
                                                pub.publishFastqInputs(this.props.fastqInputs);
                                            }
                                        }}
                                    >
                                        <td className={`${val.uuid}Class`}>{val.alias}</td>
                                        <td className={`${val.uuid}Class`}>{val.imported ? "In Project" : val.path}</td>
                                        <td className={`${val.uuid}Class`}>{val.sizeString}</td>
                                    </tr>
                                )
                            }) : undefined}
                        </tbody>
                    </table>
                    {
                        this.props.fastqInputs ? this.props.fastqInputs.length > 0 ?
                        <img 
                            className={`${activeHover} ${activeHoverButton}`}
                            src={getReadable("img/import.png")}
                            onClick={() => {
                                pub.importSelectedFastqs(this.props.fastqInputs);
                            }}
                        /> : "" : ""
                    }
                </div>
            </div>
        );*/
    }
}
