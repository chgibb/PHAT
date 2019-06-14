import * as React from "react";

import { Table } from "../components/table";
import { AlignData } from '../../alignData';
import { CompareArrows } from '../components/icons/compareArrows';
import { LinkableRefSeq } from '../../getLinkableRefSeqs';

export interface CompatibleRefTableProps
{
    linkableRefSeqs : Array<LinkableRefSeq>;
    mapToLinkUuid : string;
}

export function CompatibleRefTable(props : CompatibleRefTableProps) : JSX.Element
{
    return (
        <Table<LinkableRefSeq>
            toolbar={true}
            title="Potentially Compatible References"
            columns={[
                {
                    title: "Sample Name",
                    field: "alias"
                },
                {
                    title: "Size",
                    field: "sizeString"
                },
            ]}
            actions={[
                (rowData : LinkableRefSeq) => ({
                    icon : CompareArrows as any,
                    tooltip : "Link This Reference",
                    onClick : () => null,
                })
            ]}
            data={props.linkableRefSeqs.filter((val : LinkableRefSeq) => {
                return val.linkable;
            })}
        />
    );
}