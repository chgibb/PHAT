import * as React from "react";

import {FullWidthFormStep} from "../../fullWidthStepperForm";
import {GridWrapper} from "../../gridWrapper";
import {Grid} from "../../../components/grid";
import {ColourPicker} from "../../../components/colourPicker";

import {NewCoverageTrackForm} from "./newCoverageTrackForm";

export function step2(this : NewCoverageTrackForm) : FullWidthFormStep
{
    return {
        label : "",
        body : (
            <div>
                <GridWrapper>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <div style={{marginTop:"3vh"}}>
                                <ColourPicker label="Track colour:" onChange={(color) => 
                                {
                                    this.setState({
                                        color : `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`
                                    });
                                }} colour={this.state.color}/>
                            </div>
                        </Grid>
                    </Grid>
                </GridWrapper>
            </div>
        )
    };
}