import * as React from "react";

import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {Dialog} from "../../../components/dialog";
import {DialogTitle} from "../../../components/dialogTitle";
import {CircularFigure} from "../../../circularFigure/circularFigure";
import {DialogActions} from "../../../components/dialogActions";
import {Button} from "../../../components/button";
import {enQueueOperation} from "../../../enQueueOperation";

export function CopyFigureDialog(this : CircularGenomeBuilderView, props: { figure: CircularFigure | undefined }): JSX.Element 
{
    return (
        <Dialog
            open={this.state.copyFigureDialogOpen}
            onClose={()=>
            {
                this.setState({copyFigureDialogOpen:false});
            }}
        >
            <DialogTitle>{"Copy Figure?"}</DialogTitle>
            <DialogActions>
                <Button
                    onClick={()=>
                    {
                        this.setState({copyFigureDialogOpen:false});
                    }}
                    type="retreat"
                    label="Cancel"
                />

                <Button
                    onClick={()=>
                    {
                        this.setState({
                            copyFigureDialogOpen:false
                        });
                                    
                        if(props.figure)
                        {
                            enQueueOperation({
                                opName: "copyCircularFigure",
                                data : props.figure
                            });
                        }
                    }}
                    type="advance"
                    label="Copy"
                />
            </DialogActions>
        </Dialog>
    );
}