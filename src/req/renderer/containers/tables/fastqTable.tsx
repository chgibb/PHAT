import * as React from "react";

import {Table,TableProps} from "../../components/table";
import {Fastq} from "../../../fastq";

export interface FastqTableProps
{
    selection? : boolean;
    onSelectionChange? : (data : Array<Fastq>,rowData? : Fastq) => void; 
    data : Array<Fastq>;
}

export function FastqTable(props : FastqTableProps) : JSX.Element
{
    return (
        <Table<Fastq>
            title=""
            columns={[
                {
                    title: "Sample Name",
                    field: "alias",
                    searchable : true,
                    hidden : false
                },
                {
                    title: "Path",
                    field: "path",
                    render: (row : Fastq) => 
                    {
                        return row.imported ? "In Project" : row.path; 
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title: "Size",
                    field: "sizeString",
                    searchable : true,
                    hidden : false
                }
            ]}
            selection={props.selection}
            onSelectionChange={props.onSelectionChange}
            data={props.data}
        />
    );
}

