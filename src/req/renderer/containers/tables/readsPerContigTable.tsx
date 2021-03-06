import * as React from "react";

import {AlignData} from "../../../alignData";
import {SamToolsIdxStatsReport} from "../../../samToolsIdxStatsReport";
import {Table} from "../../components/table";

export interface ReadsPerContigTable
{
    align? : AlignData;
}

/**
 * Table of aligned reads per contig
 *
 * @export
 * @param {ReadsPerContigTable} props - Component properties
 * @returns {JSX.Element}
 */
export function ReadsPerContigTable(props : ReadsPerContigTable) : JSX.Element
{
    return (
        <Table<SamToolsIdxStatsReport>
            title=""
            data={props.align ? props.align.idxStatsReport ? props.align.idxStatsReport : [] : []}
            columns={[
                {
                    title: "Contig Name",
                    render : (row) => 
                    {
                        return row.refSeqName;
                    },
                    searchable : true,
                    field : "refSeqName",
                    hidden : false
                },
                {
                    title: "Length",
                    render : (row) => 
                    {
                        return row.seqLength;
                    },
                    searchable : true,
                    field : "seqLength",
                    hidden : false
                },
                {
                    title: "Mapped Reads",
                    render : (row) => 
                    {
                        return row.mappedReads;
                    },
                    searchable : true,
                    field : "mappedReads",
                    hidden : false
                },
                {
                    title: "Unmapped Reads",
                    render : (row) => 
                    {
                        return row.unMappedReads;
                    },
                    searchable : true,
                    field : "unMappedReads",
                    hidden : false
                }
            ]}
        />
    );
}
