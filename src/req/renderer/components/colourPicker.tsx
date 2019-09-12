import * as React from "react";
import { SketchPicker, ColorResult, RGBColor } from "react-color";
import { Grid } from './grid';
import { Typography } from './typography';
import { GridWrapper } from '../containers/gridWrapper';
import { IconButton } from './iconButton';
import { ColorLensRounded } from './icons/colorLensRounded';
import { style } from 'typestyle';
import { Paper } from './paper';
import { Close } from './icons/close';

export { ColorResult } from "react-color";

export interface ColourPickerProps {
    label: string;
    labelStyle?: React.CSSProperties;
    colourPickerStyle?: React.CSSProperties;
    colour: string;
    onChange: (colour: ColorResult) => void;
}

export interface ColourPickerState {
    open: boolean;
}

export class ColourPicker extends React.Component<ColourPickerProps, ColourPickerState>
{
    public constructor(props: ColourPickerProps) {
        super(props);

        this.state = {
            open: false
        };
    }

    public render(): JSX.Element {
        let labelStyle = this.props.labelStyle ? this.props.labelStyle : { marginLeft: "2.5vh" };
        let colourPickerStyle = this.props.colourPickerStyle ? this.props.colourPickerStyle : { marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh", marginTop: "1vh" };
        return (
            <React.Fragment>
                <div
                    style={labelStyle}
                >
                    <Grid container spacing={4} justify="flex-start">
                        <Typography>{this.props.label}</Typography>
                        {
                            !this.state.open ?
                            <IconButton
                                onClick={() => {
                                    this.setState({
                                        open: true
                                    });
                                }}
                            >
                                <ColorLensRounded
                                    color="primary"
                                    classes={{ colorPrimary: style({ color: this.props.colour }) }}
                                />
                                </IconButton>
                                : null
                        }
                    </Grid>
                </div>
                {
                    this.state.open ?
                        <GridWrapper>
                            <div
                                style={colourPickerStyle}
                            >
                                <Grid container spacing={4} justify="center">
                                    <Grid item>
                                        <div>
                                            <Grid container spacing={4} justify="flex-end">
                                                <Grid item>
                                                    <IconButton
                                                        onClick={() => {
                                                            this.setState({
                                                                open: false
                                                            });
                                                        }}
                                                    >
                                                        <Close color="secondary" />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                            <SketchPicker
                                                color={this.props.colour}
                                                onChange={this.props.onChange}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </GridWrapper> : null
                }
            </React.Fragment>
        )
    }
}