import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as React from "react";
import { AppBar } from '../../components/appBar';
import { Toolbar } from '../../components/toolBar';
import { IconButton } from '../../components/iconButton';
import { MenuRounded } from '../../components/icons/menuRounded';
import { white } from '../../styles/colours';
import { CircularFigure } from '../../circularFigure/circularFigure';
import { Fasta } from '../../../fasta';
import { SaveKeyEvent } from '../../../ipcEvents';
import { CircularGenome } from './containers/circularGenome/circularGenome';
import { DonutLargeOutlined } from '../../components/icons/donutLargeOutlined';
import { WavesOutlined } from '../../components/icons/wavesOutlined';
import { FigureSelectOverlay } from './containers/overlays/figureSelectOverlay';
import { appBar } from './containers/styles/appBar';


export interface CircularGenomeBuilderViewState {
    figureSelectDrawerOpen: boolean;
    selectedFigure: string;
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
                <AppBar position="fixed" className={appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{ colorPrimary: white }}
                            onClick={() => {
                                this.setState({
                                    figureSelectDrawerOpen: !this.state.figureSelectDrawerOpen
                                });
                            }}
                        >
                            <MenuRounded />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{ colorPrimary: white }}
                        >
                            <DonutLargeOutlined />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="primary"
                            classes={{ colorPrimary: white }}
                        >
                            <WavesOutlined />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <FigureSelectOverlay builder={this} />
                {
                    this.props.figures.map((x) => {
                        if (x.uuid == this.state.selectedFigure) {
                            return (
                                <CircularGenome
                                    figure={x}
                                />
                            )
                        }
                        return null;
                    })
                }
            </React.Fragment>
        );
    }
}