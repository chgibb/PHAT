import * as React from "react";

import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {CircularFigure} from "../../../circularFigure/circularFigure";
import {EditFigureNameOverlay} from "./overlays/editFigureName";
import {FigureSelectOverlay} from "./overlays/figureSelectOverlay";
import { EditContigsOverlay } from './overlays/editContigsOverlay';

export function GenomeBuilderOverlays(this: CircularGenomeBuilderView, props: { figure: CircularFigure | undefined }): JSX.Element 
{
    let figure = props.figure;
    return (
        <React.Fragment>
            {
                figure ?
                    <React.Fragment>
                        <EditFigureNameOverlay
                            value={figure.name}
                            open={this.state.editFigureNameOverlayOpen}
                            onSave={(value) => 
                            {
                                if (value && figure) 
                                {
                                    this.changeName(figure, value);
                                }
                            }}
                            onClose={() => 
                            {
                                this.setState({
                                    editFigureNameOverlayOpen: false
                                });
                            }}
                        />
                        <EditContigsOverlay
                            figure={figure}
                            open={this.state.editContigsOverlayOpen}
                            onClose={() => {
                                this.setState({
                                    editContigsOverlayOpen : false
                                });
                            }}
                        />
                    </React.Fragment> : null
            }
            <FigureSelectOverlay
                builder={this}
                open={this.state.figureSelectOvelayOpen}
                onClose={() => 
                {
                    this.setState({
                        figureSelectOvelayOpen: false
                    });
                }}
            />
        </React.Fragment>
    );
}