import { CircularGenomeBuilderView } from '../circularGenomeBuilderView';
import { CircularFigure, CoverageTrackLayer } from '../../../circularFigure/circularFigure';

export function toggleCoverageTrackLayerVisibility(this : CircularGenomeBuilderView,figure : CircularFigure,track : CoverageTrackLayer) : void
{
    this.maybePushEdit(
        figure,{
            description : "Toggle coverage track visibility",
            commit:(figure:CircularFigure) => {
                let trackIndex = figure.renderedCoverageTracks.findIndex((x) => x.uuid == track.uuid);

                if(trackIndex)
                {
                    figure.renderedCoverageTracks[trackIndex].checked = !track.checked;
                }
            },
            afterCommit:()=>{
                this.saveFigures();
            },rollback:(newFigure : CircularFigure,oldFigure:CircularFigure)=>{
                let trackIndex = newFigure.renderedCoverageTracks.findIndex((x) => x.uuid == track.uuid);

                if(trackIndex)
                {
                    newFigure.renderedCoverageTracks[trackIndex].checked = !oldFigure.renderedCoverageTracks[trackIndex].checked;
                }
            }
        }
    );
}