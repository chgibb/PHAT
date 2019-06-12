import * as React from "react";

import * as pub from "./publish";
import { AlignData } from '../../alignData';
import { Button } from '../components/button';

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
                    label="Browse"
                />
            </React.Fragment>
        )
    }
}

