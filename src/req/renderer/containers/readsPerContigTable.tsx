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
            toolbar={false}
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
                },
                {
                    title: "Length",
                    render : (row) => 
                    {
                        return row.seqLength;
                    },
                    searchable : true
                },
                {
                    title: "Mapped Reads",
                    render : (row) => 
                    {
                        return row.mappedReads;
                    },
                    searchable : true
                },
                {
                    title: "Unmapped Reads",
                    render : (row) => 
                    {
                        return row.unMappedReads;
                    },
                    searchable : true
                }
            ]}
        />
    );
}
