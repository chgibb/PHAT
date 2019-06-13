import * as React from "react";

import { Table } from "../components/table";
import { AlignData } from '../../alignData';
import { CompareArrows } from '../components/icons/compareArrows';

export interface LinkMapTableProps 
{
    aligns: Array<AlignData>;
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
                toolbar={false}
                columns={[
                    {
                        title: "File Name",
                        field: "alias"
                    },
                    {
                        title: "Size",
                        field: "sizeString"
                    },
                    {
                        title: "Ref Seq",
                        field: "",
                        render: (row: AlignData) => {
                            return row.fasta ? row.fasta.alias : "Not Linked"
                        }
                    }
                ]}
                actions={[
                    (rowData: AlignData) => ({
                        icon: CompareArrows as any,
                        tooltip: "Link This Reference",
                        onClick: () => null,
                        disabled: !!rowData.fasta
                    })
                ]}
                data={this.props.aligns}
            />
        );
    }
}
