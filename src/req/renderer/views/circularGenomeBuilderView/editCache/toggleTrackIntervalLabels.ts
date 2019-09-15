import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";

export function toggleTrackIntervalLabels(this: CircularGenomeBuilderView, figure: CircularFigure, showLabels: 0 | 1): void 
{
    this.maybePushEdit(
        figure, {
            description: "Toggle track interval labels",
            commit: (figure: CircularFigure) => 
            {
                figure.circularFigureBPTrackOptions.showLabels = showLabels;
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                newFigure.circularFigureBPTrackOptions.showLabels = oldFigure.circularFigureBPTrackOptions.showLabels;
            }
        }
    );
} 
