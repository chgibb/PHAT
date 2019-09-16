import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";

export function changeIntervalLength(this: CircularGenomeBuilderView, figure: CircularFigure, interval: number): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change interval length to ${interval}`,
            commit: (figure: CircularFigure) => 
            {
                figure.circularFigureBPTrackOptions.interval = interval;
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                newFigure.circularFigureBPTrackOptions.interval = oldFigure.circularFigureBPTrackOptions.interval;
            }
        }
    );
} 
