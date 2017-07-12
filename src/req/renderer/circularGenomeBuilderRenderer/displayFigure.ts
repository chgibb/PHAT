import * as fs from "fs";

import * as cf from "./../circularFigure";
import * as tc from "./templateCache";
import * as plasmid from "./../circularGenome/plasmid";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";
export async function displayFigure(self : GenomeView) : Promise<void>
{
    //This is an unholy mess adapted from the example given inline in the
    //angular source code https://github.com/angular/angular.js/blob/master/src/auto/injector.js
    //We remove the div this view is bound to, recreate it and re render the angular template into it
    //Then we pass the div into angular to compile the templates and then finally inject it all back into
    //the page.
    //The promise and setImmediate wrapping around each step is to ensure that the event loop has a chance to process
    //DOM updates, so we can signal our progress to the user in the loading modal.
    return new Promise<void>((resolve,reject) => {

        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let totalBP = 0;
        let $div : any;
        (async function() : Promise<void>{
            return new Promise<void>((resolve,reject) => {
                setImmediate(function(){
                    setImmediate(function(){
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

        
                        for(let i = 0; i != self.genome.contigs.length; ++i)
                        {
                            totalBP += self.genome.contigs[i].bp;
                        }
                        console.log("finished setup");

                        document.getElementById("loadingText").innerText = "Getting templates...";
                        console.log("set loading 1");
                        resolve();
                    });
                });
            });
        })().then(() => {
            (async function() : Promise<void>{
                return new Promise<void>((resolve,reject) =>{
                    setImmediate(function(){
                        setImmediate(function(){
                            tc.refreshCache(self.genome);
                            $div = $(
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
                                                res += tc.getCachedCoverageTrack(self.genome.renderedCoverageTracks[i]);
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
                                                res += tc.getCachedSNPTrack(self.genome.renderedSNPTracks[i]);
                                            }
                                        }
                                        return res;
                                    })()}
                                    ${plasmid.end()}
                                </div>
                            `);
                            $(document.body).append($div);
                            console.log("appended div");

                            document.getElementById("loadingText").innerText = "Compiling templates...";
                            console.log("set loading 2");
                            resolve();
                        });
                    });
                });
            })().then(() => {
                (async function() : Promise<void>{
                    return new Promise<void>((resolve,reject) => {
                        setImmediate(function(){
                            setImmediate(function(){
                                angular.element(document).injector().invoke(function($compile : any){
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
                                    console.log("finished compiling");
                                    resolve();
                                });
                            });
                        });
                    });
                })().then(() => {
                    resolve();
                });
            });
        });
    });
}