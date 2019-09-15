import * as React from "react";

import { CircularFigure } from '../../../../circularFigure/circularFigure';
import { Overlay } from './overlay';
import { GridWrapper } from '../../../../containers/gridWrapper';
import { Grid } from '../../../../components/grid';
import { Typography } from '../../../../components/typography';
import { OutlinedInput } from '../../../../components/outlinedInput';
import { Button } from '../../../../components/button';
import { Switch } from '../../../../components/switch';
import { FormGroup } from '../../../../components/formGroup';
import { FormControlLabel } from '../../../../components/formControlLabel';

export interface EditBPTrackOverlayProps {
    onClose: () => void;
    onSave: (opts: {
        newRadius?: number,
        newShowLabels? : 0 | 1,
    }) => void;
    open: boolean;
    figure: CircularFigure;
}

export function EditBPTrackOverlay(props: EditBPTrackOverlayProps): JSX.Element {
    let enteredRadius: number | undefined;

    let [showLabels, setShowLabels] = React.useState(props.figure.circularFigureBPTrackOptions.showLabels);

    return (
        <Overlay
            kind="drawerLeft"
            restrictions={["noModal"]}
            open={props.open}
            onClose={props.onClose}
        >
            <React.Fragment>
                <GridWrapper>
                    <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh" }}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <Typography variant="h5">Edit Radius and Interval</Typography>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                <div style={{ marginLeft: "2.5vh" }}>
                    <Grid container spacing={4} justify="flex-start">
                        <Typography>Radius:</Typography>
                    </Grid>
                </div>
                <GridWrapper>
                    <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <OutlinedInput
                                    label={props.figure.radius.toString()}
                                    inputProps={{
                                        onChange: (event) => {
                                            let newRadius: number | typeof NaN = parseFloat(event.target.value);
                                            if (isNaN(newRadius)) {
                                                alert("Radius must be a number");
                                                return;
                                            }

                                            enteredRadius = newRadius;
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                <GridWrapper>
                    <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch
                                            color="primary"
                                            checked={showLabels ? true : false}
                                            onChange={(event) => {
                                                setShowLabels(event.target.checked ? 1 : 0);
                                            }}
                                        />}

                                        label="Show Interval Labels"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                <GridWrapper>
                    <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <Button
                                    label="Cancel"
                                    onClick={props.onClose}
                                    type="retreat"
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    label="Save"
                                    onClick={() => {
                                        props.onSave({
                                            newRadius: enteredRadius,
                                            newShowLabels: showLabels != props.figure.circularFigureBPTrackOptions.showLabels ? showLabels : undefined
                                        });
                                    }}
                                    type="advance"
                                />
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
            </React.Fragment>
        </Overlay>
    );
}