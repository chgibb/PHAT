import * as React from "react";

import {BLASTRunForm} from "../BLASTRunForm";
import {FullWidthFormStep} from "../../fullWidthStepperForm";
import {GridWrapper} from "../../gridWrapper";
import {Grid} from "../../../components/grid";
import {Paper} from "../../../components/paper";
import {Typography} from "../../../components/typography";

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
                                    <Grid container spacing={4} justify="center">
                                        <Grid item>
                                            <Typography>
                                                Scanned {form.state.readsScanned ? form.state.readsScanned : 0} reads
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </GridWrapper>
                                {form.state.readsWithFragments ?
                                    <GridWrapper>
                                        <Grid container spacing={4} justify="center">
                                            <Grid item>
                                                <Typography variant="h5" component="h3">
                                                    {form.state.readsWithFragments.length} potential BLAST candidates
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </GridWrapper> : ""}
                            </Paper>
                        </Grid>
                    </Grid>
                </GridWrapper>

            </div>
        )
    };
}