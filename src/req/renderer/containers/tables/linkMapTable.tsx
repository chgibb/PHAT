import * as React from "react";

import {Table} from "../../components/table";
import {AlignData} from "../../../alignData";
import {CompareArrows} from "../../components/icons/compareArrows";
import {Fasta} from "../../../fasta";

export interface LinkMapTableProps 
{
    aligns: Array<AlignData>;
    fastaInputs : Array<Fasta>;
    linkMapOnClick : (data : AlignData) => void;
}

/**
 * Returns true if the given alignment map has already been linked. False otherwise
 *
 * @param {AlignData} row - Alignment map to return link status on
 * @returns {boolean}
 */
function alreadyLinked(row : AlignData) : boolean
{
    return !!row.fasta; 
}

/**
 * Returns true if there are no reference sequences given, false otherwise
 *
 * @param {Array<Fasta>} [fastaInputs] - Collection of reference sequences
 * @returns {boolean}
 */
function noReferences(fastaInputs? : Array<Fasta>) : boolean
{
    if(!fastaInputs)
        return true;
    if(!fastaInputs.length)
        return true;
    return false;
}

export class LinkMapTable extends React.Component<LinkMapTableProps, {}>
{
    public constructor(props : LinkMapTableProps)
    {
        super(props);
    }

    public render() 
    {
        return (
            <Table<AlignData>
                title=""
                columns={[
                    {
                        title: "File Name",
                        field: "alias",
                        searchable : true,
                        hidden : false
                    },
                    {
                        title: "Size",
                        field: "sizeString",
                        searchable : true,
                        hidden : false
                    },
                    {
                        title: "Ref Seq",
                        field: "",
                        render: (row: AlignData) => 
                        {
                            return row.fasta ? row.fasta.alias : "Not Linked";
                        },
                        searchable : true,
                        hidden : false
                    }
                ]}
                actions={[
                    (rowData: AlignData) => ({
                        icon: CompareArrows as any,
                        tooltip: alreadyLinked(rowData) ? "Already Linked" :
                            noReferences(this.props.fastaInputs) ? "No References to Link Against" : 
                                "Link This Reference",
                        onClick: () => 
                        {
                            this.props.linkMapOnClick(rowData);
                        },
                        disabled: alreadyLinked(rowData) || noReferences(this.props.fastaInputs)
                    })
                ]}
                data={this.props.aligns}
            />
        );
    }
}
