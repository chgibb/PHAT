import * as React from "react";

import { Fasta } from '../fasta';
import { Table } from '../components/table';
import { getReadable } from '../getAppPath';
import { ThreeQuartersLoader } from '../components/threeQuartersLoader';
import { tableIcons } from '../components/tableIcons';

export interface FastaTableProps
{
    shouldAllowTriggeringOps : boolean;
    onIndexForVizClick : (event : React.MouseEvent<HTMLButtonElement, MouseEvent>,data : Fasta) => void;
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
                        !props.shouldAllowTriggeringOps ? <ThreeQuartersLoader /> : undefined
                    }
                }
            ]}
            actions={[
                (rowData : Fasta) => ({
                    icon : tableIcons.Add as any,
                    tooltip : "Index For Visualization",
                    onClick : props.onIndexForVizClick,
                    disabled : rowData.indexedForVisualization
                })
            ]}
            data={props.data}
        />
    )
}

