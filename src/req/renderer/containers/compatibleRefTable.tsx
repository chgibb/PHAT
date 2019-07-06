import * as React from "react";

import {Table} from "../components/table";
import {AlignData} from "../../alignData";
import {CompareArrows} from "../components/icons/compareArrows";
import {LinkableRefSeq} from "../../getLinkableRefSeqs";
import {Fasta} from "../../fasta";

export interface CompatibleRefTableProps
{
    fastaInputs : Array<Fasta>;
    linkableRefSeqs : Array<LinkableRefSeq>;
    linkActionClick : (row : CompatibleRefTableRow) => void;
}

export interface CompatibleRefTableRow
{
    fasta : Fasta;
    linkableRefSeq : LinkableRefSeq;
}

export function composeCompatibleRefTableRows(fastaInputs : Array<Fasta>,linkableRefSeqs : Array<LinkableRefSeq>) : Array<CompatibleRefTableRow>
{
    let res = new Array<CompatibleRefTableRow>();

    for(let i = 0; i != fastaInputs.length; ++i)
    {
        for(let k = 0; k != linkableRefSeqs.length; ++k)
        {
            if(linkableRefSeqs[k].linkable && fastaInputs[i].uuid == linkableRefSeqs[k].uuid)
            {
                res.push({
                    fasta : fastaInputs[i],
                    linkableRefSeq : linkableRefSeqs[k]
                });
            }
        }
    }

    return res;
}

export function CompatibleRefTable(props : CompatibleRefTableProps) : JSX.Element
{
    let rows = composeCompatibleRefTableRows(props.fastaInputs,props.linkableRefSeqs);
    return (
        <Table<CompatibleRefTableRow>
            toolbar={true}
            title="Potentially Compatible References"
            columns={[
                {
                    title: "Sample Name",
                    field: "alias",
                    render : (row : CompatibleRefTableRow) => 
                    {
                        return row.fasta.alias;
                    }
                },
                {
                    title: "Size",
                    field: "sizeString",
                    render : (row : CompatibleRefTableRow) => 
                    {
                        return row.fasta.sizeString;
                    }
                },
            ]}
            actions={[
                (rowData : CompatibleRefTableRow) => ({
                    icon : CompareArrows as any,
                    tooltip : "Link This Reference",
                    onClick : () => 
                    {
                        props.linkActionClick(rowData);
                    },
                })
            ]}
            data={rows}
        />
    );
}