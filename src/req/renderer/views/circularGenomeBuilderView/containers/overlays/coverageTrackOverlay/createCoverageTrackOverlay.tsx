import * as React from "react";

import {CircularFigure} from "../../../../../circularFigure/circularFigure";
import {Contig} from "../../../../../../fastaContigLoader";
import {Grid} from "../../../../../components/grid";
import {Typography} from "../../../../../components/typography";
import {NewCoverageTrackForm} from "../../../../../containers/forms/newCoverageTrackForm/newCoverageTrackForm";
import {AlignData} from "../../../../../../alignData";

export interface CreateCoverageTrackOverlayProps
{
    figure : CircularFigure;
    selectedContig : Contig;
    align : AlignData;
    onComplete : () => void;
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
                <div style={{marginLeft: "2.5vh"}}>
                    <Grid container spacing={4} justify="flex-start">
                        <Typography>New Coverage Track for {this.props.selectedContig.alias}:</Typography>
                    </Grid>
                </div>
                <NewCoverageTrackForm
                    figure={this.props.figure}
                    contig={this.props.selectedContig}
                    align={this.props.align}
                    onComplete={()=>{
                        this.props.onComplete();
                    }}
                />
            </React.Fragment>
        );
    }
}
