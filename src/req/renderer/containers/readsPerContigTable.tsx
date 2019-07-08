import * as React from "react";

import {AlignData} from "../../alignData";
import {SamToolsIdxStatsReport} from "../../samToolsIdxStatsReport";
import {Table} from "../components/table";

export interface ReadsPerContigTable
{
    align : AlignData;
    isSubTable? : boolean;
}

export function ReadsPerContigTable(props : ReadsPerContigTable) : JSX.Element
{
    return (
        <Table<SamToolsIdxStatsReport>
            title=""
            data={props.align.idxStatsReport}
            isSubTable={props.isSubTable}
            columns={[
                {
                    title: "Contig Name",
                    render : (row) => 
                    {
                        return row.refSeqName;
                    },
                    searchable : true
                    ,
                            field : "refSeqName"
                },
                {
                    title: "Length",
                    render : (row) => 
                    {
                        return row.seqLength;
                    },
                    searchable : true,
                    field : "seqLength"
                },
                {
                    title: "Mapped Reads",
                    render : (row) => 
                    {
                        return row.mappedReads;
                    },
                    searchable : true,
                    field : "mappedReads"
                },
                {
                    title: "Unmapped Reads",
                    render : (row) => 
                    {
                        return row.unMappedReads;
                    },
                    searchable : true,
                    field : "unMappedReads"
                }
            ]}
        />
    );
}
