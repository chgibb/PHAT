import * as React from "react";
import { AlignData } from '../../alignData';
import { BLASTSegmentResult } from '../../BLASTSegmentResult';
import { Table } from '../components/table';

export interface BLASTRunsTableProps
{
    align : AlignData;
    isSubTable? : boolean;
}

export function BLASTRunsTable(props : BLASTRunsTableProps) : JSX.Element
{
    return (
        <Table<BLASTSegmentResult>
            toolbar={false}
            title=""
            data={props.align.BLASTSegmentResults}
            columns={[
                {
                    title : "Start",
                    render : (row) => {
                        return row.start;
                    }
                },
                {
                    title : "Stop",
                    render : (row) => {
                        return row.stop
                    }
                },
                {
                    title : "Reads BLASTed",
                    render : (row) => {
                        return row.readsBLASTed;
                    }
                },
                {
                    title : "Program",
                    render : (row) => {
                        return row.program;
                    }
                },
                {
                    title : "Date Ran",
                    render : (row) => {
                        return row.dateStampString;
                    }
                }
            ]}
        />
    );
}