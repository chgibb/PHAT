import * as React from "react";
import { CircularFigure } from '../../../../../circularFigure/circularFigure';
import { Contig } from '../../../../../../fastaContigLoader';

export interface CreateCoverageTrackOverlayProps
{
    figure : CircularFigure;
    selectedContig : Contig;
}

export interface CreateCoverageTrackOverlayState
{

}

export class CreateCoverageTrackOverlay extends React.Component<CreateCoverageTrackOverlayProps,CreateCoverageTrackOverlayState>
{
    public constructor(props : CreateCoverageTrackOverlayProps)
    {
        super(props);

        this.state = {

        };
    }

    public render() : JSX.Element
    {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}
