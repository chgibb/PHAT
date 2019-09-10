import * as React from "react";
import { SketchPicker, ColorResult, RGBColor } from "react-color";

import { CircularFigure, Contig } from "../../../../circularFigure/circularFigure";
import { GridWrapper } from "../../../../containers/gridWrapper";
import { Grid } from "../../../../components/grid";
import { IconButton } from "../../../../components/iconButton";
import { blue } from "../../../../styles/colours";
import { ChevronLeft } from "../../../../components/icons/chevronLeft";
import { OutlinedInput } from "../../../../components/outlinedInput";
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography';

export interface EditContigOverlayProps {
    onClose: () => void;
    onSave: (opts: {
        contigUuid: string,
        newName?: string,
        newTextColour?: string,
        newBodyColour?: string,
    }) => void;
    figure: CircularFigure;
    contig: Contig;
    allowMovingSelectContig: boolean;
}

export interface EditContigOverlayState {

}

export function EditContigOverlay(props: EditContigOverlayProps): JSX.Element {
    let endteredName = "";
    let enteredTextColour: ColorResult | undefined;
    let enteredBodyColour: ColorResult | undefined;
    return (
        <div>

            <div style={{ marginLeft: "2vh" }}>
                <Grid container spacing={4} justify="flex-start">
                    <IconButton
                        edge="start"
                        color="primary"
                        classes={{ colorPrimary: blue }}
                        onClick={props.onClose}
                    >
                        <ChevronLeft />
                    </IconButton>
                </Grid>
            </div>

            <div style={{ marginLeft: "2.5vh" }}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Name in reference:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <Typography>{props.contig.name}</Typography>
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{ marginLeft: "2.5vh" }}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Name to display:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <OutlinedInput
                                label={props.contig.alias}
                                inputProps={{
                                    onChange: (event) => {
                                        endteredName = event.target.value;
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{ marginLeft: "2.5vh" }}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Text opacity:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <OutlinedInput
                                label={props.contig.opacity ? props.contig.opacity.toString() : ""}
                                inputProps={{
                                    onChange: (event) => {
                                        if(event.target.value)
                                        {
                                            console.log(parseFloat(event.target.value));
                                            if(parseFloat(event.target.value) == NaN)
                                            {
                                                alert(`Opacity must be a number`);
                                            }
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{ marginLeft: "2.5vh" }}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Text colour:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <SketchPicker
                                color={props.contig.fontFill}
                                onChange={(color: ColorResult) => {
                                    enteredTextColour = color;
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{ marginLeft: "2.5vh" }}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Body colour:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <SketchPicker
                                color={props.contig.color}
                                onChange={(color: ColorResult) => {
                                    enteredBodyColour = color;
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
                                        contigUuid: props.contig.uuid,
                                        newName: endteredName,
                                        newBodyColour: enteredBodyColour ? enteredBodyColour.hex : '', 
                                        newTextColour : undefined
                                    });
                                }}
                                type="advance"
                            />
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
        </div>
    );
}