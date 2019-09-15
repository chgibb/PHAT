import * as React from "react";

import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {CircularFigure} from "../../../circularFigure/circularFigure";

import {EditFigureNameOverlay} from "./overlays/editFigureName";
import {FigureSelectOverlay} from "./overlays/figureSelectOverlay";
import {EditContigsOverlay} from "./overlays/editContigsOverlay";
import { EditBPTrackOverlay } from './overlays/editBPTrackOverlay';

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
                            newContig={() => 
                            {
                                if(figure)
                                {
                                    this.newCustomContig(figure);
                                }
                            }}
                            onSave={(opts) => 
                            {
                                if(figure)
                                {
                                    if(opts.newName)
                                    {
                                        this.changeContigText(figure,opts.contigUuid,opts.newName);
                                    }

                                    if(opts.newBodyColour)
                                    {
                                        this.changeContigBodyColour(figure,opts.contigUuid,opts.newBodyColour);
                                    }

                                    if(opts.newTextColour)
                                    {
                                        this.changeContigTextColour(figure,opts.contigUuid,opts.newTextColour);
                                    }
                                    
                                    if(opts.newOpacity !== undefined)
                                    {
                                        this.changeContigOpacity(figure,opts.contigUuid,opts.newOpacity);
                                    }

                                    if(opts.newVadjust !== undefined)
                                    {
                                        this.changeContigVadjust(figure,opts.contigUuid,opts.newVadjust);
                                    }

                                    if(opts.newStart !== undefined)
                                    {
                                        this.changeContigStart(figure,opts.contigUuid,opts.newStart);
                                    }

                                    if(opts.newEnd !== undefined)
                                    {
                                        this.changeContigEnd(figure,opts.contigUuid,opts.newEnd);
                                    }
                                }
                            }}
                            onClose={() => 
                            {
                                this.setState({
                                    editContigsOverlayOpen : false
                                });
                            }}
                        />
                        <EditBPTrackOverlay
                            figure={figure}
                            open={this.state.editBPTrackOptionsOverlayOpen}
                            onSave={(opts)=>{
                                if(figure)
                                {
                                if(opts.newRadius !== undefined)
                                {
                                    this.changeRadius(figure,opts.newRadius);
                                }
                            }
                            }}
                            onClose={()=>{
                                this.setState({
                                    editBPTrackOptionsOverlayOpen : false
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