import * as React from "react";

import {Fasta} from "../../fasta";
import {LinkableRefSeq} from "../../getLinkableRefSeqs";
import {Table} from "../components/table";
import {Info} from "../components/icons/info";

export interface IncompatibleRefTableProps
{
    fastaInputs : Array<Fasta>;
    linkableRefSeqs : Array<LinkableRefSeq>;
}

export interface IncompatibleRefTableRow
{
    alias : string;
    sizeString : string;
    reason : string;
    longReason : string;
}

export function composeIncompatibleRefTableRows(fastaInputs : Array<Fasta>,linkableRefSeqs : Array<LinkableRefSeq>) : Array<IncompatibleRefTableRow>
{
    let res = new Array<IncompatibleRefTableRow>();

    for(let i = 0; i != fastaInputs.length; ++i)
    {
        for(let k = 0; k != linkableRefSeqs.length; ++k)
        {
            if(!linkableRefSeqs[k].linkable && fastaInputs[i].uuid == linkableRefSeqs[k].uuid)
            {
                res.push({
                    alias : fastaInputs[i].alias,
                    sizeString : fastaInputs[i].sizeString,
                    reason : linkableRefSeqs[k].reason,
                    longReason : linkableRefSeqs[k].longReason
                });
            }
        }
    }

    return res;
}

export function IncompatibleRefTable(props : IncompatibleRefTableProps) : JSX.Element
{
    let rows = composeIncompatibleRefTableRows(props.fastaInputs,props.linkableRefSeqs);
    return (
        <Table<IncompatibleRefTableRow>
            title="Incompatible References"
            columns={[
                {
                    title : "Sample Name",
                    field : "alias",
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
                    title : "Reason",
                    field : "reason",
                    searchable : true,
                    hidden : false
                }
            ]}
            actions={[
                (rowData : IncompatibleRefTableRow) => ({
                    icon : Info as any,
                    tooltip : "See Detailed Reason",
                    onClick : () => 
                    {
                        alert(rowData.longReason ? rowData.longReason : "");
                    }
                })
            ]}
            data={rows}
        />
    );
}
