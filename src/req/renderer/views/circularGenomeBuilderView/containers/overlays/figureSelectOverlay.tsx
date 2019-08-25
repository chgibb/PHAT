import * as React from "react";

import {CircularGenomeBuilderView} from "../../circularGenomeBuilderView";
import {GridWrapper} from "../../../../containers/gridWrapper";
import {Grid} from "../../../../components/grid";
import {Typography} from "../../../../components/typography";
import {IconButton} from "../../../../components/iconButton";
import {AddBox} from "../../../../components/icons/addBox";

import {Overlay} from "./overlay";

export interface FigureSelectOverlayProps {
    builder: CircularGenomeBuilderView;
}

export function FigureSelectOverlay(props: FigureSelectOverlayProps): JSX.Element 
{
    return (
        <Overlay
            kind="drawerLeft"
            onClose ={ () => 
            {
                props.builder.setState({
                    figureSelectDrawerOpen: false
                });
            }}
            open={props.builder.state.figureSelectDrawerOpen}
        >
            <div>
                <GridWrapper>
                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh"}}>
                        <Grid container spacing={4} justify="center">
                            <Grid item>
                                <Typography variant="h5">Open a Figure</Typography>
                            </Grid>
                        </Grid>
                    </div>
                </GridWrapper>
                {
                    props.builder.props.fastas.map((fasta) => 
                    {
                        return (
                            <div>
                                <GridWrapper>
                                    <div style={{marginLeft: "1vh", marginBottom: "1vh"}}>
                                        <Grid container direction="row" spacing={1} justify="flex-start">
                                            <Grid item>
                                                <Typography variant="h6">{fasta.alias}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    onClick={() => 
                                                    {
                                                        props.builder.newFigure(fasta);
                                                    }}
                                                >
                                                    <AddBox />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </GridWrapper>
                                {
                                    props.builder.props.figures.map((figure) => 
                                    {
                                        if (fasta.uuid == figure.uuidFasta) 
                                        {
                                            return (
                                                <GridWrapper>
                                                    <div style={{marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh"}}>
                                                        <Grid container spacing={4} justify="center">
                                                            <Grid item>
                                                                <Typography variant="caption" onClick={() => 
                                                                {
                                                                    props.builder.setState({
                                                                        selectedFigure: figure.uuid,
                                                                        figureSelectDrawerOpen : false
                                                                    });
                                                                }}>{figure.name}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </GridWrapper>
                                            );
                                        }
                                        return null;
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        </Overlay>
    );
}
