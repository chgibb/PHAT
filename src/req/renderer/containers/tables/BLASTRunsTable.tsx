import * as React from "react";

import {AlignData} from "../../../alignData";
import {BLASTSegmentResult} from "../../../BLASTSegmentResult";
import {Table} from "../../components/table";

import {BLASTSingleRunTable} from "./BLASTSingleRunTable";

export interface BLASTRunsTableProps
{
    align? : AlignData;
}

/**
 * Table of completed BLAST runs
 *
 * @export
 * @param {BLASTRunsTableProps} props - Component properties
 * @returns {JSX.Element}
 */
export function BLASTRunsTable(props : BLASTRunsTableProps) : JSX.Element
{
    return (
        <Table<BLASTSegmentResult>
            title=""
            data={props.align ? props.align.BLASTSegmentResults ? props.align.BLASTSegmentResults : [] : []}
            detailPanel={[
                {
                    tooltip : "View BLAST Run",
                    render : (rowData : BLASTSegmentResult) => 
                    {
                        if(props.align && props.align.BLASTSegmentResults)
                        {
                            return (
                                <BLASTSingleRunTable
                                    align={props.align}
                                    BLASTuuid={rowData.uuid}
                                />
                            );
                        }

                        return null;
                    }
                }
            ]}
            columns={[
                {
                    title : "Start",
                    render : (row) => 
                    {
                        return row.start!;
                    },
                    searchable : true,
                    field : "start",
                    hidden : false
                },
                {
                    title : "Stop",
                    render : (row) => 
                    {
                        return row.stop!;
                    },
                    searchable : true,
                    field : "stop",
                    hidden : false
                },
                {
                    title : "Reads BLASTed",
                    render : (row) => 
                    {
                        return row.readsBLASTed!;
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
                        return row.dateStampString!;
                    },
                    searchable : true,
                    field : "dateStampString",
                    hidden : true
                },
                
            ]}
        />
    );
}