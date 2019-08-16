import * as React from "react";

import { BLASTRunForm } from '../BLASTRunForm';
import { FullWidthFormStep } from '../../fullWidthStepperForm';
import { GridWrapper } from '../../gridWrapper';
import { Grid } from '../../../components/grid';
import { FormControl } from '../../../components/formControl';
import { InputLabel } from '../../../components/inputLabel';
import { OutlinedInput } from '../../../components/outlinedInput';

export function step1(form: BLASTRunForm): FullWidthFormStep {
    let label = "Select Range to BLAST";

    if (form.validateSelectedRange()) {
        label = `Search From ${form.state.start} to ${form.state.stop}`;
    }

    if (form.props.align && form.props.align.fasta) {
        return {
            label: label,
            body: (<div>
                <GridWrapper>
                    <React.Fragment>
                        <div style={{ marginBottom: "10vh" }} />
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <OutlinedInput
                                    label="Start"
                                    inputProps={{
                                        type: "number",
                                        onChange : form.onStepOneStartChange
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <OutlinedInput
                                    label="End"
                                    inputProps={{
                                        type: "number",
                                        onChange : form.onStepOneEndChange
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                </GridWrapper>
            </div>)
        };
    }

    return {
        label: "This Alignment Must be Linked to a Reference",
        body: (<div></div>)
    };
}
