import * as React from "react";
import { Fasta } from '../fasta';
import { Table } from '../components/table';
import { getReadable } from '../getAppPath';
import { threeQuartersLoader } from '../renderer/styles/threeQuartersLoader';

export interface FastaTableProps
{
    shouldAllowTriggeringOps: boolean;
    data : Array<Fasta>;
}

export function FastaTable(props : FastaTableProps) : JSX.Element
{
    return (
        <Table<Fasta>
            toolbar={false}
            title=""
            columns={[
                {
                    title : "Reference Name",
                    field : "alias"
                },
                {
                    title : "Path",
                    field : "path",
                    render : (row : Fasta) => {
                        return row.imported ? "In Project" : row.path;
                    }
                },
                {
                    title : "Size",
                    field : "sizeString"
                },
                {
                    title : "Ready For Visualization",
                    field : "indexedForVisualization",
                    render : (row : Fasta) => {
                        return row.indexedForVisualization ? <img src={getReadable("img/pass.png")} /> : 
                        props.shouldAllowTriggeringOps ? "Not Ready" : 
                        !props.shouldAllowTriggeringOps ? <div className={threeQuartersLoader} /> : undefined
                    }
                }
            ]}
            data={props.data}
        />
    )
}

