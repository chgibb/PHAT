import * as React from "react";
import { Overlay } from './overlay';
import { OutlinedInput } from '../../../../components/outlinedInput';
import { CircularGenomeBuilderView } from '../../circularGenomeBuilderView';
import { GridWrapper } from '../../../../containers/gridWrapper';
import { Grid } from '../../../../components/grid';
import { Typography } from '../../../../components/typography';
import { Button } from '../../../../components/button';


export interface EditFigureNameOverlayProps {
    onClose: () => void;
    onSave: (value: string) => void;
    open: boolean;
    value: string;
}

export function EditFigureNameOverlay(props: EditFigureNameOverlayProps): JSX.Element {
    let enteredValue = "";

    return (
        <Overlay
            kind="modal"
            onClose={props.onClose}
            open={props.open}
        >
            <React.Fragment>
                <GridWrapper>
                    <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "2vh" }}>
                        <Grid container spacing={4} justify="center">
                            <Typography variant="h5">Edit Figure Name</Typography>
                        </Grid>
                    </div>
                </GridWrapper>
                <GridWrapper>
                    <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" }}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <OutlinedInput
                                    label={props.value}
                                    inputProps={{
                                        onChange: (event) => {
                                            enteredValue = event.target.value;
                                        }
                                    }}
                                ></OutlinedInput>
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
                                        props.onSave(enteredValue);
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
