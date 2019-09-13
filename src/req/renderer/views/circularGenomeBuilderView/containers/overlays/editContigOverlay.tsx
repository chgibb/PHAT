import * as React from "react";
import {ColorResult} from "react-color";

import {CircularFigure, Contig} from "../../../../circularFigure/circularFigure";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {IconButton} from "../../../../components/iconButton";
import {blue} from "../../../../styles/colours";
import {ChevronLeft} from "../../../../components/icons/chevronLeft";
import {OutlinedInput} from "../../../../components/outlinedInput";
import {Button} from "../../../../components/button";
import {Typography} from "../../../../components/typography";
import {ColourPicker} from "../../../../components/colourPicker";

export interface EditContigOverlayProps {
    onClose: () => void;
    onSave: (opts: {
        contigUuid: string,
        newName?: string,
        newTextColour?: string,
        newBodyColour?: string,
        newOpacity? : number;
    }) => void;
    figure: CircularFigure;
    contig: Contig;
    allowMovingSelectContig: boolean;
}

export interface EditContigOverlayState {

}

export function EditContigOverlay(props: EditContigOverlayProps): JSX.Element 
{
    let endteredName = "";
    let enteredTextColour: ColorResult | undefined;
    let enteredBodyColour: ColorResult | undefined;
    let enteredOpacity : number | undefined;
    return (
        <div>

            <div style={{marginLeft: "2vh"}}>
                <Grid container spacing={4} justify="flex-start">
                    <IconButton
                        edge="start"
                        color="primary"
                        classes={{colorPrimary: blue}}
                        onClick={props.onClose}
                    >
                        <ChevronLeft />
                    </IconButton>
                </Grid>
            </div>

            <div style={{marginLeft: "2.5vh"}}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Name in reference:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <Typography>{props.contig.name}</Typography>
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{marginLeft: "2.5vh"}}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Name to display:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <OutlinedInput
                                label={props.contig.alias}
                                inputProps={{
                                    onChange: (event) => 
                                    {
                                        endteredName = event.target.value;
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{marginLeft: "2.5vh"}}>
                <Grid container spacing={4} justify="flex-start">
                    <Typography>Text opacity:</Typography>
                </Grid>
            </div>
            <GridWrapper>
                <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh"}}>
                    <Grid container spacing={4} justify="center">
                        <Grid item>
                            <OutlinedInput
                                label={props.contig.opacity ? props.contig.opacity.toString() : ""}
                                inputProps={{
                                    onChange: (event) => 
                                    {
                                        if(event.target.value)
                                        {
                                            let newOpacity : number | typeof NaN = parseFloat(event.target.value);
                                            if(isNaN(newOpacity))
                                            {
                                                alert("Opacity must be a number");
                                                return;
                                            }

                                            else if(newOpacity < 0)
                                            {
                                                alert("Opacity must be greater than 0");
                                                return;
                                            }

                                            else if(newOpacity > 1)
                                            {
                                                alert("Opacity must be less than 1");
                                                return;
                                            }
                                            enteredOpacity = newOpacity;
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </GridWrapper>
            <div style={{marginBottom:"1vh"}}>
                <ColourPicker
                    label="Text Colour"
                    colour={props.contig.fontFill ? props.contig.fontFill : ""}
                    onChange={(color: ColorResult) => 
                    {
                        enteredTextColour = color;
                    }}
                />
            </div>
            <ColourPicker
                label="Body Colour"
                colour={props.contig.color ? props.contig.color : ""}
                onChange={(color: ColorResult) => 
                {
                    enteredBodyColour = color;
                }}
            />
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
                                        contigUuid: props.contig.uuid,
                                        newName: endteredName,
                                        newBodyColour: enteredBodyColour ? enteredBodyColour.hex : "", 
                                        newTextColour : enteredTextColour ? enteredTextColour.hex : "",
                                        newOpacity : enteredOpacity
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