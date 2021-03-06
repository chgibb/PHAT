import * as React from "react";

import {Button} from "../../../components/button";
import {FastaTable} from "../../../containers/tables/fastaTable";
import {Fasta} from "../../../../fasta";
import * as pub from "../publish";

import {inputFastaDialog} from "./inputFastaDialog";

export interface FastaViewProps
{
    fastaInputs? : Array<Fasta>;
    shouldAllowTriggeringOps : boolean;
}

export class FastaView extends React.Component<FastaViewProps,{}>
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
                    type="remain"
                    onClick={() => 
                    {
                        inputFastaDialog();
                    }}
                    label="Browse"
                />
                <FastaTable
                    actions={true} 
                    data={this.props.fastaInputs ? this.props.fastaInputs : []} 
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
                            type="remain"
                            onClick={() => 
                            {
                                if(this.props.fastaInputs)
                                    pub.importSelectedFastas(this.props.fastaInputs);
                            }}
                            label="Import All"
                        /> : "" : ""
                }
            </React.Fragment>
        );
    }
}
