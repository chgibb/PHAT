import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as React from "react";
import { AppBar } from '../../components/appBar';
import { Toolbar } from '../../components/toolBar';
import { IconButton } from '../../components/iconButton';
import { MenuRounded } from '../../components/icons/menuRounded';
import { white } from '../../styles/colours';
import { CircularFigure } from '../../circularFigure';
import { Fasta } from '../../../fasta';
import { Drawer } from '../../components/drawer';
import { GridWrapper } from '../../containers/gridWrapper';
import { Grid } from '../../components/grid';
import { Typography } from '../../components/typography';
import { AddBox } from '../../components/icons/addBox';
import { SaveKeyEvent } from '../../../ipcEvents';

export interface CircularGenomeBuilderViewState {
    figureSelectDrawerOpen: boolean;
}

export interface CircularGenomeBuilderViewProps {
    figures: Array<CircularFigure>;
    fastas: Array<Fasta>;
}

export class CircularGenomeBuilderView extends React.Component<CircularGenomeBuilderViewProps, CircularGenomeBuilderViewState>
{
    public constructor(props: CircularGenomeBuilderViewProps) {
        super(props);

        this.state = {
            figureSelectDrawerOpen: false,
        } as CircularGenomeBuilderViewState;
    }

    public newFigure(fasta: Fasta): void {
        ipc.send(
            "saveKey",
            {
                action: "saveKey",
                channel: "circularGenomeBuilder",
                key: "circularFigures",
                val: [...this.props.figures, new CircularFigure("New Figure", fasta.uuid, fasta.contigs)]
            } as SaveKeyEvent
        );

    }


    public render(): JSX.Element {
        return (
            <React.Fragment>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{ colorPrimary: white }}
                        >
                            <MenuRounded
                                onClick={() => {
                                    this.setState({
                                        figureSelectDrawerOpen: true
                                    });
                                }}
                            />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    anchor="left"
                    open={this.state.figureSelectDrawerOpen}
                    onClose={() => {
                        this.setState({
                            figureSelectDrawerOpen: false
                        });
                    }}
                >
                    <div>
                        <GridWrapper>
                            <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh" }}>
                                <Grid container spacing={4} justify="center">
                                    <Grid item>
                                        <Typography variant="h5">Open a Figure</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </GridWrapper>
                        {
                            this.props.fastas.map((fasta) => {
                                return (
                                    <div>
                                        <GridWrapper>
                                            <div style={{ marginLeft: "1vh", marginBottom: "1vh" }}>
                                                <Grid container direction="row" spacing={1} justify="flex-start">
                                                    <Grid item>
                                                        <Typography variant="h6">{fasta.alias}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton
                                                            onClick={() => {
                                                                this.newFigure(fasta);
                                                            }}
                                                        >
                                                            <AddBox />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </GridWrapper>
                                        {
                                            this.props.figures.map((figure) => {
                                                if (fasta.uuid == figure.uuidFasta) {
                                                    return (
                                                        <GridWrapper>
                                                            <div style={{ marginRight: "1vh", marginLeft: "1vh", marginBottom: "1vh" }}>
                                                                <Grid container spacing={4} justify="center">
                                                                    <Grid item>
                                                                        <Typography variant="caption">{figure.name}</Typography>
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
                                )
                            })
                        }
                    </div>
                </Drawer>
            </React.Fragment>
        );
    }
}