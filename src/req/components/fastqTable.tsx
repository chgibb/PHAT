import * as React from "react";

import {Table} from "./table";
import {Fastq} from '../fastq';

export interface FastqTableProps
{
    data : Array<Fastq>;
}

export function FastqTable(props : FastqTableProps) : JSX.Element
{
    return (
        <Table<Fastq>
            toolbar={false}
            title=""
            columns={[
                {
                    title: "Sample Name",
                    field: "alias"
                },
                {
                    title: "Path",
                    field: "path",
                    render: (row : Fastq) => {
                        return row.imported ? "In Project" : row.path; 
                    }
                },
                {
                    title: "Size",
                    field: "sizeString"
                }
            ]}
            data={props.data}
        />
    );
}

