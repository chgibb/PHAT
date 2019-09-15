import { CircularGenomeBuilderView } from "../circularGenomeBuilderView";
import { CircularFigure, initContigForDisplay, Contig } from "../../../circularFigure/circularFigure";

export function newCustomContig(this: CircularGenomeBuilderView, figure: CircularFigure): void {
    this.maybePushEdit(
        figure, {
        description: `Add new custom contig to figure`,
        commit: (figure: CircularFigure) => {
            let contig = new Contig();
            initContigForDisplay(contig, true);

            contig.start = 0;
            contig.end = figure.contigs[0].bp;
            contig.name = `Custom Contig ${figure.customContigs.length + 1}`;
            contig.alias = "Custom Contig";

            figure.customContigs.push(contig);
        },
        afterCommit: () => {
            this.saveFigures();
        },
        rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => {
            newFigure.customContigs.pop();
        }
    }
    );
}
