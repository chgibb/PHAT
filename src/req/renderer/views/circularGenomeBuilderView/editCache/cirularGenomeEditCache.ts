import {CircularFigure} from "../../../circularFigure/circularFigure";

export interface CircularGenomeEditAction
{
    figureStr : string;
    description : string;
    commit : (figure : CircularFigure) => void;
    afterCommit : () => void;
    rollback : (newFigure : CircularFigure,oldFigure : CircularFigure) => void;
}

export type CircularGenomeEditOpts = Omit<CircularGenomeEditAction,"figureStr">;

export class CircularGenomeEditCache
{
    private editStack : Array<CircularGenomeEditAction>;

    public pushEdit(figure : CircularFigure,opts : CircularGenomeEditOpts) : void
    {
        this.editStack.push({
            figureStr : JSON.stringify(figure),
            description : opts.description,
            commit : opts.commit,
            afterCommit : opts.afterCommit,
            rollback : opts.rollback
        });

        let edit = this.editStack[this.editStack.length - 1];
        edit.commit(figure);
        edit.afterCommit();
    }

    public popEdit(figure : CircularFigure) : CircularGenomeEditAction | undefined
    {
        return this.editStack.pop();
    }

    public constructor()
    {
        this.editStack = new Array();
    }
}