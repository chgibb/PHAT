import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";

export function changeRadius(this: CircularGenomeBuilderView, figure: CircularFigure, radius: number): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change radius to ${radius}`,
            commit: (figure: CircularFigure) => 
            {
                figure.radius = radius;
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                newFigure.radius = oldFigure.radius;
            }
        }
    );
} 
