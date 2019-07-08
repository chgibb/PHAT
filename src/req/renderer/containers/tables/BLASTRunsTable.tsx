import * as React from "react";

import {AlignData} from "../../../alignData";
import {BLASTSegmentResult} from "../../../BLASTSegmentResult";
import {Table, SubTableProps} from "../../components/table";

import {BLASTSingleRunTable} from "./BLASTSingleRunTable";

export interface BLASTRunsTableProps
{
    align : AlignData;
    subTableProps : SubTableProps;
}

export function BLASTRunsTable(props : BLASTRunsTableProps) : JSX.Element
{
    return (
        <Table<BLASTSegmentResult>
            title=""
            data={props.align.BLASTSegmentResults}
            subTableProps={props.subTableProps}
            detailPanel={[
                {
                    tooltip : "View BLAST Run",
                    render : (rowData : BLASTSegmentResult) => 
                    {
                        return (
                            <BLASTSingleRunTable
                                align={props.align}
                                BLASTuuid={rowData.uuid}
                                subTableProps={{
                                    isSubTable : true,
                                    nesting : 2
                                }}
                            />
                        );
                    }
                }
            ]}
            columns={[
                {
                    title : "Start",
                    render : (row) => 
                    {
                        return row.start;
                    },
                    searchable : true,
                    field : "start",
                    hidden : false
                },
                {
                    title : "Stop",
                    render : (row) => 
                    {
                        return row.stop;
                    },
                    searchable : true,
                    field : "stop",
                    hidden : false
                },
                {
                    title : "Reads BLASTed",
                    render : (row) => 
                    {
                        return row.readsBLASTed;
                    },
                    searchable : true,
                    field : "readsBLASTed",
                    hidden : false
                },
                {
                    title : "Program",
                    render : (row) => 
                    {
                        return row.program;
                    },
                    searchable : true,
                    field : "program",
                    hidden : false
                },
                {
                    title : "Date Ran",
                    render : (row) => 
                    {
                        return row.dateStampString;
                    },
                    searchable : true,
                    field : "dateStampString",
                    hidden : true
                },
                
            ]}
        />
    );
}