import * as React from "react";
import {style} from "typestyle";

import {FullWidthFormStep} from "../../fullWidthStepperForm";
import {GridWrapper} from "../../gridWrapper";
import {Grid} from "../../../components/grid";
import {Typography} from "../../../components/typography";
import {ColorLensRounded} from "../../../components/icons/colorLensRounded";

import {NewCoverageTrackForm} from "./newCoverageTrackForm";


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
                            /></Grid>
                            
                    </Grid>
                    
                </GridWrapper>
            </div>
        )
    };
}