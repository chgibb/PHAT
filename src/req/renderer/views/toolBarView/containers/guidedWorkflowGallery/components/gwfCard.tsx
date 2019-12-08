import * as React from "react";

import {Paper} from "../../../../../components/paper";
import {Grid} from "../../../../../components/grid";
import {GridWrapper} from "../../../../../containers/gridWrapper";
import {activeHover} from "../../../../../styles/activeHover";
import {Typography} from "../../../../../components/typography";

export interface GWFCardProps {
    title: string;
    imagePath: string;
}

export class GWFCard extends React.Component<GWFCardProps, {}>
{
    public constructor(props: GWFCardProps) 
    {
        super(props);
    }

    public render(): JSX.Element 
    {
        return (
            <Paper style={{width:"72vh",marginLeft:"2vh"}}  className={activeHover}>
                <div style={{marginLeft: "2vh"}}>
                    <GridWrapper>
                        <Grid container spacing={1} justify="flex-start">
                            <Grid item>
                                <Typography>{this.props.title}</Typography>
                            </Grid>
                        </Grid>
                    </GridWrapper>
                    <img
                        style={{width:"70vh",height:"50vh"}} 
                        src={this.props.imagePath} />
                </div>
            </Paper>
        );
    }
}