import * as React from "react";
import {style} from "typestyle";

import {FullWidthFormStep} from "../../fullWidthStepperForm";
import {GridWrapper} from "../../gridWrapper";
import {Grid} from "../../../components/grid";
import {Typography} from "../../../components/typography";
import {ColorLensRounded} from "../../../components/icons/colorLensRounded";

import {NewCoverageTrackForm} from "./newCoverageTrackForm";
import { Button } from '../../../components/button';
import { enQueueOperation } from '../../../enQueueOperation';


export function step3(this : NewCoverageTrackForm) : FullWidthFormStep
{
    return {
        label: "Confirm and Begin",
        body : (
            <div>
                <GridWrapper>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <Typography>{this.state.log10Scale ? "Log10 Scale, " : ""}scale by {this.state.scaleFactor}</Typography>
                        </Grid>
                        <Grid item>
                            <ColorLensRounded
                                color="primary"
                                classes={{colorPrimary: style({color: this.state.color})}}
                            />
                            </Grid>
                    </Grid>
                </GridWrapper>
                <GridWrapper>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <Button 
                                label="Start"
                                type="advance"
                                onClick={()=>{
                                    enQueueOperation({
                                        opName: "renderCoverageTrackForContig",
                                        alignData: this.props.align,
                                        circularFigure: this.props.figure,
                                        contiguuid : this.props.contig.uuid,
                                        colour: this.state.color,
                                        log10Scale: this.state.log10Scale,
                                        scaleFactor : this.state.scaleFactor
                                    });

                                    this.props.onComplete();
                                }}
                            />
                        </Grid>
                    </Grid>
                </GridWrapper>
            </div>
        )
    };
}