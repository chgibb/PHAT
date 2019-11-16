import * as React from "react";

import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {Dialog} from "../../../components/dialog";
import {DialogTitle} from "../../../components/dialogTitle";
import {CircularFigure} from "../../../circularFigure/circularFigure";
import {DialogActions} from "../../../components/dialogActions";
import {Button} from "../../../components/button";
import {enQueueOperation} from "../../../enQueueOperation";

export function DeleteFigureDialog(this : CircularGenomeBuilderView, props: { figure: CircularFigure | undefined }): JSX.Element 
{
    return (
        <Dialog
            open={this.state.deleteFigureDialogOpen}
            onClose={()=>
            {
                this.setState({deleteFigureDialogOpen:false});
            }}
        >
            <DialogTitle>{"Delete Figure?"}</DialogTitle>
            <DialogActions>
                <Button
                    onClick={()=>
                    {
                        this.setState({deleteFigureDialogOpen:false});
                    }}
                    type="retreat"
                    label="Cancel"
                />

                <Button
                    onClick={()=>
                    {
                        this.setState({
                            deleteFigureDialogOpen:false
                        });
                                    
                        if(props.figure)
                        {
                            enQueueOperation({
                                opName: "deleteCircularFigure",
                                data : props.figure
                            });
                        }
                    }}
                    type="advance"
                    label="Delete"
                />
            </DialogActions>
        </Dialog>
    );
}