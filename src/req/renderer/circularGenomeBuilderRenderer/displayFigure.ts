import * as fs from "fs";

import * as cf from "./../circularFigure";
import * as plasmid from "./../circularGenome/plasmid";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";
export function displayFigure(self : GenomeView) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {

        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        try
        {
            document.body.removeChild(document.getElementById("controls"));
        }
        catch(err){}
        try
        {
            //Remove the div this view is bound to
            document.body.removeChild(document.getElementById(self.div));
        }
        catch(err){}
        $("#"+self.div).remove();

        let totalBP = 0;
        for(let i = 0; i != self.genome.contigs.length; ++i)
        {
            totalBP += self.genome.contigs[i].bp;
        }

        //This is an unholy mess adapted from the example given inline in the
        //angular source code https://github.com/angular/angular.js/blob/master/src/auto/injector.js
        //We remove the div this view is bound to, recreate it and re render the angular template into it
        //Then we pass the div into angular to compile the templates and then finally inject it all back into
        //the page
        document.getElementById("loadingText").innerText = "Getting templates...";
        let $div = $(
            `
                <div id="${self.div}" style="z-index=-1;">
                    ${plasmid.add(
                    {
                        sequenceLength : totalBP.toString(),
                        plasmidHeight : "{{genome.height}}",
                        plasmidWidth : "{{genome.width}}"
                    })}
                        ${cf.getBaseFigureFromCache(self.genome)}
                        ${(()=>{
                            let res = "";
                            for(let i = 0; i != self.genome.renderedCoverageTracks.length; ++i)
                            {
                                if(self.genome.renderedCoverageTracks[i].checked)
                                {
                                   res += (<any>fs.readFileSync(
                                            cf.getCachedCoverageTrackPath(
                                                self.genome.renderedCoverageTracks[i]
                                            )));
                                }
                            }
                            return res;
                        })()}
                        ${(()=>{
                            let res = "";
                            for(let i = 0; i != self.genome.renderedSNPTracks.length; ++i)
                            {
                                if(self.genome.renderedSNPTracks[i].checked)
                                {
                                    res += (<any>fs.readFileSync(
                                            cf.getCachedSNPTrackPath(
                                                self.genome.renderedSNPTracks[i]
                                            )));
                                }
                            }
                            return res;
                        })()}
                    ${plasmid.end()}
                </div>
                `
            );
        $(document.body).append($div);
        angular.element(document).injector().invoke
        (
            function($compile : any)
            {
                document.getElementById("loadingText").innerText = "Compiling templates...";
                //This should probably be done with an actual angular scope instead 
                //of mutating the existing scope
                let scope = angular.element($div).scope();
                scope.genome = self.genome;
                scope.alignData = self.alignData;
                scope.markerOnClick = self.markerOnClick;
                scope.figureNameOnClick = self.figureNameOnClick;
                scope.inputRadiusOnChange = self.inputRadiusOnChange;
                scope.showBPTrackOnChange = self.showBPTrackOnChange;
                scope.exportSVG = self.exportSVG;
                scope.showContigCreator = self.showContigCreator;
                scope.postRender = self.postRender;
                scope.firstRender = self.firstRender;
                scope.div = self.div;
                $compile($div)(scope);
                resolve();
            }
        );
    });
}