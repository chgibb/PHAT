import * as React from "react";

import {Fasta} from "../../fasta";
import {getReadable} from "../../getAppPath";
import {AddBox} from "../components/icons/addBox";
import {Table} from "../components/table";
import {ThreeQuartersLoader} from "../components/threeQuartersLoader";


export interface FastaTableProps
{
    shouldAllowTriggeringOps : boolean;
    actions? : boolean;
    onIndexForVizClick : (event : React.MouseEvent<HTMLButtonElement, MouseEvent>,data : Fasta) => void;
    selection? : boolean;
    onSelectionChange? : (data : Array<Fasta>,rowData? : Fasta) => void;
    data : Array<Fasta>;
}

export function FastaTable(props : FastaTableProps) : JSX.Element
{
    return (
        <Table<Fasta>
            title=""
            columns={[
                {
                    title : "Reference Name",
                    field : "alias",
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Path",
                    field : "path",
                    render : (row : Fasta) => 
                    {
                        return row.imported ? "In Project" : row.path;
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Size",
                    field : "sizeString",
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Ready For Visualization",
                    field : "indexedForVisualization",
                    render : (row : Fasta) => 
                    {
                        return row.indexedForVisualization ? <img src={getReadable("img/pass.png")} /> : 
                            props.shouldAllowTriggeringOps ? "Not Ready" : 
                                !props.shouldAllowTriggeringOps ? <ThreeQuartersLoader /> : undefined;
                    },
                    searchable : true,
                    hidden : false
                }
            ]}
            actions={props.actions ? [
                (rowData : Fasta) => ({
                    icon : (() => 
                    {
                        return (
                            <div className={`${rowData.uuid}IndexForVisualization`}><AddBox /></div>
                        );
                    }) as any,
                    tooltip : "Index For Visualization",
                    onClick : props.onIndexForVizClick,
                    disabled : rowData.indexedForVisualization
                })
            ] : undefined}
            selection={props.selection}
            onSelectionChange={props.onSelectionChange}
            data={props.data}
        />
    );
}
