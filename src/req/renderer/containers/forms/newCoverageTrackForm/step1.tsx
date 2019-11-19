import * as React from "react";

import {FullWidthFormStep} from "../../fullWidthStepperForm";
import {GridWrapper} from "../../gridWrapper";
import {Grid} from "../../../components/grid";
import {Switch} from "../../../components/switch";
import {FormGroup} from "../../../components/formGroup";
import {FormControlLabel} from "../../../components/formControlLabel";
import {OutlinedInput} from "../../../components/outlinedInput";
import {Typography} from "../../../components/typography";

import {NewCoverageTrackForm} from "./newCoverageTrackForm";

export function step1(this : NewCoverageTrackForm) : FullWidthFormStep
{
    let label = "Configure Scaling";

    if(this.state.currentStep != 0)
    {
        if(this.state.log10Scale)
        {
            label = `log10 scale and then scale by ${this.state.scaleFactor}`;
        }

        else
        {
            label = `Scale by ${this.state.scaleFactor}`;
        }
    }

    return {
        label : label,
        body : (
            <div>
                <GridWrapper>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="primary"
                                            checked={this.state.log10Scale}
                                            onChange={(event) => 
                                            {
                                                this.setState({
                                                    log10Scale : event.target.checked
                                                });
                                            }}
                                        />
                                    }
                                    label="Log10 scale"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item style={{marginTop:".5vh"}}>
                            <GridWrapper>
                                <Grid container spacing={4} justify="center">
                                    <Grid item>
                                        <Typography>And then scale by:</Typography>
                                    </Grid>
                                </Grid>
                            </GridWrapper>
                            <OutlinedInput
                                label={this.state.scaleFactor.toString()}
                                inputProps={{
                                    type : "number",
                                    onChange : (event) => 
                                    {
                                        let value = parseFloat(event.target.value);

                                        if(!isNaN(value))
                                        {
                                            this.setState({
                                                scaleFactor : value

                                            });
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </GridWrapper>
            </div>
        )
    };
}