import * as React from "react";
import { CircularFigure, Contig } from '../../../../circularFigure/circularFigure';
import { Typography } from '../../../../components/typography';
import { GridWrapper } from '../../../../containers/gridWrapper';
import { Grid } from '../../../../components/grid';
import { IconButton } from '../../../../components/iconButton';
import { blue } from '../../../../styles/colours';
import { ChevronLeft } from '../../../../components/icons/chevronLeft';
import { OutlinedInput } from '../../../../components/outlinedInput';

export interface EditContigOverlayProps
{
    onClose : () => void;
    figure : CircularFigure;
    contig : Contig;
    allowMovingSelectContig : boolean;
}

export function EditContigOverlay(props : EditContigOverlayProps) : JSX.Element
{
    return (
        <div>
            <GridWrapper>
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
            </GridWrapper>
            <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh",marginTop: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <OutlinedInput
                                    label={props.contig.alias}
                                    inputProps={{
                                        onChange: (event) => {

                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
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
                                        props.onSave(enteredValue);
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