import {CircularFigure} from "../../../circularFigure/circularFigure";
import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";

export function changeName(this: CircularGenomeBuilderView, figure: CircularFigure, name: string): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change name from ${figure.name} to ${name}`,
            commit: (figure: CircularFigure) => 
            {
                figure.name = name;
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                newFigure.name = oldFigure.name;
            }
        }
    );
} 
