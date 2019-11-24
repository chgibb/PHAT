import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {CircularFigure} from "../../../circularFigure/circularFigure";

export function changeContigStart(this: CircularGenomeBuilderView, figure: CircularFigure, contigUuid: string, start: number): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change contig start to ${start}`,
            commit: (figure: CircularFigure) => 
            {
                let contig = figure.contigs.find(x => x.uuid == contigUuid);

                if(!contig)
                    contig = figure.customContigs.find(x => x.uuid == contigUuid);

                if (contig) 
                {
                    contig.start = start;
                }
            },
            afterCommit: () => 
            {
                this.saveFigures();
            },
            rollback: (newFigure: CircularFigure, oldFigure: CircularFigure) => 
            {
                let newContig = newFigure.contigs.find(x => x.uuid == contigUuid);
                let oldContig = oldFigure.contigs.find(x => x.uuid == contigUuid);

                if(!newContig)
                    newContig = newFigure.customContigs.find(x => x.uuid == contigUuid);
                if(!oldContig)
                    oldContig = oldFigure.customContigs.find(x => x.uuid == contigUuid);

                if (newContig && oldContig) 
                {
                    newContig.start = oldContig.start;
                }
            }
        }
    );
}
