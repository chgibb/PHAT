import * as React from "react";

import * as pub from "./publish";
import { AlignData } from '../../alignData';
import { Button } from '../components/button';
import { inputAlignDialog } from './inputAlignDialog';
import { Table } from '../components/table';
import { LinkMapTable } from '../containers/linkMapTable';

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
                <LinkMapTable aligns={this.props.aligns} />
            </React.Fragment>
        )
    }
}

