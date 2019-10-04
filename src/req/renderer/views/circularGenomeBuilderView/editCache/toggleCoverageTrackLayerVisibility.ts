import {CircularGenomeBuilderView} from "../circularGenomeBuilderView";
import {CircularFigure, CoverageTrackLayer} from "../../../circularFigure/circularFigure";

export function toggleCoverageTrackLayerVisibility(this : CircularGenomeBuilderView,figure : CircularFigure,track : CoverageTrackLayer) : void
{
    this.maybePushEdit(
        figure,{
            description : "Toggle coverage track visibility",
            commit:(figure:CircularFigure) => 
            {
                let trackIndex = figure.visibleLayers.findIndex((x) => x == track.uuid);

                if(trackIndex >= 0)
                {
                    figure.visibleLayers.splice(trackIndex,1);
                }

                else
                {
                    figure.visibleLayers.push(track.uuid);
                }
            },
            afterCommit:()=>
            {
                this.saveFigures();
            },
            rollback:(newFigure : CircularFigure,oldFigure:CircularFigure)=>
            {
                let trackIndex = newFigure.visibleLayers.findIndex((x) => x == track.uuid);

                if(trackIndex >= 0)
                {
                    newFigure.visibleLayers.splice(trackIndex,1);
                }

                else
                {
                    newFigure.visibleLayers.push(track.uuid);
                }
            }
        }
    );
}