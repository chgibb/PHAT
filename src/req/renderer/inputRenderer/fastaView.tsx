import * as React from "react";
import {Component} from "react";

import {Button} from "../components/button";
import {FastaTable} from "../containers/fastaTable";

import * as pub from "./publish";
import {Fasta} from "./../../fasta";
import {inputFastaDialog} from "./inputFastaDialog";

export interface FastaViewProps
{
    fastaInputs : Array<Fasta>;
    shouldAllowTriggeringOps : boolean;
}

export class FastaView extends Component<FastaViewProps,{}>
{
    public constructor(props : FastaViewProps)
    {
        super(props);
    }

    public render()
    {
        return (
            <React.Fragment>
                <Button
                    onClick={() => 
                    {
                        inputFastaDialog();
                    }}
                    label="Browse"
                />
                <FastaTable 
                    data={this.props.fastaInputs} 
                    shouldAllowTriggeringOps={this.props.shouldAllowTriggeringOps}
                    onIndexForVizClick={(event,data) => 
                    {
                        event;
                        pub.indexFastaForVisualization(data);
                    }}
                />
                {
                    this.props.fastaInputs ? this.props.fastaInputs.length > 0 ?
                        <Button
                            onClick={() => 
                            {
                                pub.importSelectedFastas(this.props.fastaInputs);
                            }}
                            label="Import All"
                        /> : "" : ""
                }
            </React.Fragment>
            /*
            <div>
                <img 
                    className={`${activeHover} ${activeHoverButton}`} 
                    src={getReadable("img/browseButton.png")}
                    onClick={() => {
                        inputFastaDialog();
                    }}
                />
                <div className={fullWidth}>
                    <table className={fullWidth}>
                        <tbody>
                            <tr>
                                <th>Referece Name</th>
                                <th>Path</th>
                                <th>Size</th>
                                <th>Ready For Visualization</th>
                            </tr>
                            {this.props.fastaInputs ? this.props.fastaInputs.map((val : Fasta,i : number) => {
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
                                                pub.publishFastaInputs(this.props.fastaInputs);
                                            }
                                        }}
                                    >
                                        <td className={`${val.uuid}Class`}>{val.alias}</td>
                                        <td className={`${val.uuid}Class`}>{val.imported ? "In Project" : val.path}</td>
                                        <td className={`${val.uuid}Class`}>{val.sizeString}</td>
                                        <td 
                                            className={`${val.uuid}Class ${!val.indexedForVisualization && this.props.shouldAllowTriggeringOps ? cellHover : ""}`}
                                            onClick={(event : React.MouseEvent<HTMLTableDataCellElement,MouseEvent>) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                
                                                pub.indexFastaForVisualization(val);
                                            }}
                                        >{
                                            val.indexedForVisualization ? <img src={getReadable("img/pass.png")} /> : 
                                            this.props.shouldAllowTriggeringOps ? "Not Ready" : 
                                            !this.props.shouldAllowTriggeringOps ? <div className={threeQuartersLoader} /> : undefined
                                        }</td>
                                    </tr>
                                )
                            }) : undefined}
                        </tbody>
                    </table>
                    {
                        this.props.fastaInputs ? this.props.fastaInputs.length > 0 ?
                        <img
                            className={`${activeHover} ${activeHoverButton}`}
                            src={getReadable("img/import.png")}
                            onClick={() => {
                                pub.importSelectedFastas(this.props.fastaInputs);
                            }}
                        /> : "" : ""
                    }
                </div>
            </div>*/
        );
    }
}
