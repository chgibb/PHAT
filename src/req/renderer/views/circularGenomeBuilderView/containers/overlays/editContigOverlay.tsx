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

export interface EditContigOverlayProps {
    onClose: () => void;
    onSave: (opts: {
        contigUuid: string,
        newName?: string,
        newColour?: string,
    }) => void;
    figure: CircularFigure;
    contig: Contig;
    allowMovingSelectContig: boolean;
}

export interface EditContigOverlayState {

}

export function EditContigOverlay(props: EditContigOverlayProps): JSX.Element {
    let endteredName = "";
    let enteredColour: RGBColor | undefined;
    return (
        <div>
            <GridWrapper>
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
            </GridWrapper>
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
            <GridWrapper>
                <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <SketchPicker
                                color={props.contig.color}
                                onChange={(color: ColorResult) => {
                                    enteredColour = color.rgb;
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
                                        newColour: enteredColour ?
                                            `rgb(${enteredColour.r},${enteredColour.g},${enteredColour.b}${enteredColour.a ? `,${enteredColour.a}` : ""})`
                                            : undefined
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