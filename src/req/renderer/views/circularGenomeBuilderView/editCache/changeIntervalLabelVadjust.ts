import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";

export function changeIntervalLabelVadjust(this: CircularGenomeBuilderView, figure: CircularFigure, vAdjust: number): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change interval vertical adjustment to ${vAdjust}`,
            commit: (figure: CircularFigure) => 
            {
                figure.circularFigureBPTrackOptions.vAdjust = vAdjust;
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                newFigure.circularFigureBPTrackOptions.vAdjust = oldFigure.circularFigureBPTrackOptions.vAdjust;
            }
        }
    );
} 
