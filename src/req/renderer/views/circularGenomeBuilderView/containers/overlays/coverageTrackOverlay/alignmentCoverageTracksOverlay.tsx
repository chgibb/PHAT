import * as React from "react";
import { Grid } from '../../../../../components/grid';
import { IconButton } from '../../../../../components/iconButton';
import { blue } from '../../../../../styles/colours';
import { ChevronLeft } from '../../../../../components/icons/chevronLeft';
import { AlignData } from '../../../../../../alignData';
import { CircularFigure } from '../../../../../circularFigure/circularFigure';

export interface AlignmentCoverageTracksOverlayProps
{
    onClose : () => void;
    align : AlignData;
    figure : CircularFigure;
}

export interface AlignmentCoverageTrackOverlayState
{

}

export class AlignmentCoverageTrackOverlay extends React.Component<AlignmentCoverageTracksOverlayProps,AlignmentCoverageTrackOverlayState>
{
    public constructor(props : AlignmentCoverageTracksOverlayProps)
    {
        super(props);

        this.state = {

        };
    }

    public render() : JSX.Element
    {
        return (
            <div style={{marginLeft: "2vh"}}>
                <Grid container spacing={4} justify="flex-start">
                    <IconButton
                        edge="start"
                        color="primary"
                        classes={{colorPrimary: blue}}
                        onClick={this.props.onClose}
                    >
                        <ChevronLeft />
                    </IconButton>
                </Grid>
            </div>
        );
    }
}