import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";

export function changeIntervalLabelDirection(this: CircularGenomeBuilderView, figure: CircularFigure, direction: "in" | "out"): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change interval direction to ${direction}`,
            commit: (figure: CircularFigure) => 
            {
                figure.circularFigureBPTrackOptions.direction = direction;
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                newFigure.circularFigureBPTrackOptions.direction = oldFigure.circularFigureBPTrackOptions.direction;
            }
        }
    );
} 
