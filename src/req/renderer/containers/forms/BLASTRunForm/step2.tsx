import * as React from "react";

import {BLASTRunForm} from "../BLASTRunForm";
import {FullWidthFormStep} from "../../fullWidthStepperForm";
import {GridWrapper} from "../../gridWrapper";
import {Grid} from "../../../components/grid";
import {Paper} from "../../../components/paper";
import {Typography} from "../../../components/typography";
import {Button} from "../../../components/button";
import {ThreeQuartersLoader} from "../../../components/threeQuartersLoader";

export function step2(form: BLASTRunForm): FullWidthFormStep 
{
    let label = "Identify Reads and Fragments to BLAST";

    return {
        label: label,
        body: (
            <div>
                <GridWrapper>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <Paper>
                                <GridWrapper>
                                    <div style={{marginTop: "1vh"}}>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item>
                                                <Typography>
                                                    Scanned {form.state.readsScanned ? form.state.readsScanned : 0} reads
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </GridWrapper>
                                {form.state.readsWithFragments ?
                                    <React.Fragment>
                                        <GridWrapper>
                                            <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh"}}>
                                                <Grid container spacing={4} justify="center">
                                                    <Grid item>
                                                        <Typography variant="h5" component="h3">
                                                            {form.state.readsWithFragments.length} potential BLAST candidates
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </GridWrapper>
                                        <GridWrapper>
                                            <Grid container spacing={4} justify="center">
                                                <Grid item>
                                                    {
                                                        form.props.shouldAllowTriggeringOps ? 
                                                            <Button
                                                                type="remain"
                                                                label="Start BLASTing"
                                                                onClick={form.onStepTwoStartBLASTingOnClick}
                                                            /> : <ThreeQuartersLoader />}
                                                </Grid>
                                            </Grid>
                                        </GridWrapper>
                                    </React.Fragment>
                                    : ""}
                            </Paper>
                        </Grid>
                    </Grid>
                </GridWrapper>

            </div>
        )
    };
}