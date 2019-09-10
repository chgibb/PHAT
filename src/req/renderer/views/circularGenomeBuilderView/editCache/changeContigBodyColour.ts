import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {CircularFigure} from "../../../circularFigure/circularFigure";

export function changeContigBodyColour(this: CircularGenomeBuilderView, figure: CircularFigure, contigUuid: string, colour: string): void 
{
    this.maybePushEdit(
        figure, {
            description: `Change contig body colour to ${colour}`,
            commit: (figure: CircularFigure) => 
            {
                let contig = figure.contigs.find(x => x.uuid == contigUuid);
            
                if (contig) 
                {
                    console.log(contig.color);
                    console.log(colour);
                    contig.color = colour;
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

                if (newContig && oldContig) 
                {
                    newContig.color = oldContig.color;
                }
            }
        }
    );
}
