import * as React from "react";

import {CircularFigure} from "../../../../circularFigure/circularFigure";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {Typography} from "../../../../components/typography";
import {OutlinedInput} from "../../../../components/outlinedInput";
import {Button} from "../../../../components/button";
import {Switch} from "../../../../components/switch";
import {FormGroup} from "../../../../components/formGroup";
import {FormControlLabel} from "../../../../components/formControlLabel";

import {Overlay} from "./overlay";

export interface EditBPTrackOverlayProps {
    onClose: () => void;
    onSave: (opts: {
        newRadius?: number,
        newInterval? : number,
        newVadjust?: number,
        newShowLabels? : 0 | 1,
        newDirection? : "in" | "out",
    }) => void;
    open: boolean;
    figure: CircularFigure;
}

export function EditBPTrackOverlay(props: EditBPTrackOverlayProps): JSX.Element 
{
    let enteredRadius: number | undefined;
    let enteredInterval : number | undefined;
    let enteredVadjust : number | undefined;

    let [showLabels, setShowLabels] = React.useState(props.figure.circularFigureBPTrackOptions.showLabels);
    let [direction,setDirection] = React.useState(props.figure.circularFigureBPTrackOptions.direction);

    return (
        <Overlay
            kind="drawerLeft"
            restrictions={["noModal"]}
            open={props.open}
            onClose={props.onClose}
        >
            <React.Fragment>
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <Typography variant="h5">Edit Radius and Interval</Typography>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                <div style={{marginLeft: "2.5vh"}}>
                    <Grid container spacing={4} justify="flex-start">
                        <Typography>Radius:</Typography>
                    </Grid>
                </div>
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <OutlinedInput
                                    label={props.figure.radius.toString()}
                                    inputProps={{
                                        onChange: (event) => 
                                        {
                                            let newRadius: number | typeof NaN = parseFloat(event.target.value);
                                            if (isNaN(newRadius)) 
                                            {
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
                <div style={{marginLeft: "2.5vh"}}>
                    <Grid container spacing={4} justify="flex-start">
                        <Typography>Show Interval Labels:</Typography>
                    </Grid>
                </div>
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch
                                            color="primary"
                                            checked={showLabels ? true : false}
                                            onChange={(event) => 
                                            {
                                                setShowLabels(event.target.checked ? 1 : 0);
                                            }}
                                        />}

                                        label=""
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                {
                    showLabels ? 
                        <React.Fragment>
                            <div style={{marginLeft: "2.5vh"}}>
                                <Grid container spacing={4} justify="flex-start">
                                    <Typography>Show Interval Labels Outside Base:</Typography>
                                </Grid>
                            </div>
                            <GridWrapper>
                                <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Switch
                                                        color="primary"
                                                        checked={direction == "out" ? true : false}
                                                        onChange={(event) => 
                                                        {
                                                            setDirection(event.target.checked ? "out" : "in");
                                                        }}
                                                    />}
                                                    label=""
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </div>
                            </GridWrapper>
                            <div style={{marginLeft: "2.5vh"}}>
                                <Grid container spacing={4} justify="flex-start">
                                    <Typography>Interval Length:</Typography>
                                </Grid>
                            </div>
                            <GridWrapper>
                                <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item>
                                            <OutlinedInput
                                                label={props.figure.circularFigureBPTrackOptions.interval.toString()}
                                                inputProps={{
                                                    onChange: (event) => 
                                                    {
                                                        let newInterval: number | typeof NaN = parseFloat(event.target.value);
                                                        if (isNaN(newInterval)) 
                                                        {
                                                            alert("Interval must be a number");
                                                            return;
                                                        }

                                                        enteredInterval = newInterval;
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </GridWrapper>
                            <div style={{marginLeft: "2.5vh"}}>
                                <Grid container spacing={4} justify="flex-start">
                                    <Typography>Interval Label Vertical Adjustment:</Typography>
                                </Grid>
                            </div>
                            <GridWrapper>
                                <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                                    <Grid container spacing={4} justify="center">
                                        <Grid item>
                                            <OutlinedInput
                                                label={props.figure.circularFigureBPTrackOptions.vAdjust.toString()}
                                                inputProps={{
                                                    onChange: (event) => 
                                                    {
                                                        let newVadjust: number | typeof NaN = parseFloat(event.target.value);
                                                        if (isNaN(newVadjust)) 
                                                        {
                                                            alert("Vertical Adjustment must be a number");
                                                            return;
                                                        }

                                                        enteredVadjust = newVadjust;
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </GridWrapper>
                        </React.Fragment> : null
                }
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
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
                                    onClick={() => 
                                    {
                                        props.onSave({
                                            newRadius: enteredRadius,
                                            newInterval : enteredInterval,
                                            newVadjust : enteredVadjust,
                                            newShowLabels: showLabels != props.figure.circularFigureBPTrackOptions.showLabels ? showLabels : undefined,
                                            newDirection : direction != props.figure.circularFigureBPTrackOptions.direction ? direction : undefined,
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