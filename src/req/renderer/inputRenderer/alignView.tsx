import * as React from "react";

import * as pub from "./publish";
import { AlignData } from '../../alignData';
import { Button } from '../components/button';
import { inputAlignDialog } from './inputAlignDialog';
import { Table } from '../components/table';

export interface AlignViewProps
{
    aligns : Array<AlignData>;
}

export class AlignView extends React.Component<AlignViewProps,{}>
{
    public constructor(props : AlignViewProps)
    {
        super(props);
    }

    public render()
    {
        return (
            <React.Fragment>
                <Button
                    onClick={() => {
                        inputAlignDialog();
                    }}
                    label="Browse"
                />
                <Table<AlignData>
                    title=""
                    toolbar={false}
                    columns={[
                        {
                            title : "File Name",
                            field : "alias"
                        },
                        {
                            title : "Size",
                            field : "sizeString"
                        },
                        {
                            title : "Ref Seq",
                            field : "",
                            render : (row : AlignData) => {
                                return row.fasta ? row.fasta.alias : "Not Linked"
                            }
                        }
                    ]}
                    data={this.props.aligns}
                />
            </React.Fragment>
        )
    }
}

