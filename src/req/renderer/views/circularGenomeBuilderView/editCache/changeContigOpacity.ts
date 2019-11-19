import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {CircularFigure} from "../../../circularFigure/circularFigure";

export function changeContigOpacity(this: CircularGenomeBuilderView, figure: CircularFigure, contigUuid: string, opacity: number): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change contig body opacity to ${opacity}`,
            commit: (figure: CircularFigure) => 
            {
                let contig = figure.contigs.find(x => x.uuid == contigUuid);

                if(!contig)
                    contig = figure.customContigs.find(x => x.uuid == contigUuid);

                if (contig) 
                {
                    contig.opacity = opacity;
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
                    newContig.opacity = oldContig.opacity;
                }
            }
        }
    );
}
