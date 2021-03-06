import * as React from "react";

import {Table} from "../../components/table";
import {AlignData} from "../../../alignData";
import {CompareArrows} from "../../components/icons/compareArrows";
import {LinkableRefSeq} from "../../../getLinkableRefSeqs";
import {Fasta} from "../../../fasta";

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

/**
 * Compose rows of data for display
 *
 * @export
 * @param {Array<Fasta>} fastaInputs - Collection of reference sequences
 * @param {Array<LinkableRefSeq>} linkableRefSeqs - Collection of linkable reference sequences
 * @returns {Array<CompatibleRefTableRow>}
 */
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

/**
 * Table of references that are compatible for linking
 *
 * @export
 * @param {CompatibleRefTableProps} props - Component properties
 * @returns {JSX.Element}
 */
export function CompatibleRefTable(props : CompatibleRefTableProps) : JSX.Element
{
    let rows = composeCompatibleRefTableRows(props.fastaInputs,props.linkableRefSeqs);
    return (
        <Table<CompatibleRefTableRow>
            title="Potentially Compatible References"
            columns={[
                {
                    title: "Sample Name",
                    field: "",
                    render : (row : CompatibleRefTableRow) => 
                    {
                        return row.fasta.alias;
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title: "Size",
                    field: "",
                    render : (row : CompatibleRefTableRow) => 
                    {
                        return row.fasta.sizeString ? row.fasta.sizeString : null;
                    },
                    searchable : true,
                    hidden : false
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