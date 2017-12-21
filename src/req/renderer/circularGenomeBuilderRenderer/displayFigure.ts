import * as fs from "fs";

import * as cf from "./../circularFigure";
import * as tc from "./templateCache";
import * as plasmid from "./../circularGenome/plasmid";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";
import {centreFigure} from "./centreFigure";
/**
 * Displays the currently set figure
 * 
 * @export
 * @param {GenomeView} self 
 * @returns {Promise<void>} 
 */
export async function displayFigure(self : GenomeView) : Promise<void>
{
    if(!self.genome.isInteractive)
        return await displayNonInteractiveFigure(self);
    else
        return await displayInteractiveFigure(self);

}
/**
 * Renders a figure as a non-interactive SVG using the specified canvas
 * 
 * @export
 * @param {GenomeView} self 
 * @returns {Promise<void>} 
 */
export async function displayNonInteractiveFigure(self : GenomeView) : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        await tc.refreshCache(self.genome);
        cleanCanvas(self);

        let $div : any = `
            <div id="${self.div}">
                ${getSelectedDataTrackSVGsFromCache(self)}
                ${tc.baseFigureSVG ? tc.baseFigureSVG : ""}
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend",$div);
        let svgs = document.getElementsByTagName("svg");
        for(let i = 0; i != svgs.length; ++i)
        {
            (<any>svgs[i].style).shapeRendering = "optimizeSpeed";
        }
        centreFigure(document.getElementById(self.div),self.genome);
        resolve();
    });
}
/**
 * Renders a figure as interactive using Angular bindings using the specified canvas
 * 
 * @export
 * @param {GenomeView} self 
 * @returns {Promise<void>} 
 */
export async function displayInteractiveFigure(self : GenomeView) : Promise<void>
{
    //This is an unholy mess adapted from the example given inline in the
    //angular source code https://github.com/angular/angular.js/blob/master/src/auto/injector.js
    //We remove the div this view is bound to, recreate it and re render the angular template into it
    //Then we pass the div into angular to compile the templates and then finally inject it all back into
    //the page.
    //The promise and setImmediate wrapping around each step is to ensure that the event loop has a chance to process
    //DOM updates, so we can signal our progress to the user in the loading modal.
    return new Promise<void>(async (resolve,reject) => {

        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let totalBP = 0;
        let $div : any;

        cleanCanvas(self);
        
        for(let i = 0; i != self.genome.contigs.length; ++i)
        {
            totalBP += self.genome.contigs[i].bp;
        }

        await tc.refreshCache(self.genome);
        let templates = cf.assembleCompilableTemplates(
            self.genome,
            `${cf.getBaseFigureFromCache(self.genome)}`
        );
        //instead of forcing angular to walk through all the svgs as well as the actual angular templates
        //in the base figure we actually want compiled, separate them into separate divs
        $div = `
            <div id="${self.div}">
                                    
                ${getSelectedDataTrackSVGsFromCache(self)}

                <div id="toCompile">
                    ${templates}
                    </div>
                </div>
        `;
        document.body.insertAdjacentHTML("beforeend",$div);
        centreFigure(document.getElementById(self.div),self.genome);
        console.log("appended div");

        let divToCompile : HTMLElement = document.getElementById("toCompile");
        angular.element(divToCompile).injector().invoke(function($compile : any){
            //This should probably be done with an actual angular scope instead 
            //of mutating the existing scope
            let scope = angular.element(divToCompile).scope();

            //occasionally, when resizing extremely large figures scope() may return undefined
            //may be related to https://github.com/angular/angular.js/issues/9515
            if(scope)
            {
                self.updateScope(scope);
                $compile(divToCompile)(scope);
                console.log("finished compiling");
            }
            else
            {
                console.log("Scope was undefined. Deferring rerender");
                setTimeout(function(){
                    self.firstRender = true;
                    viewMgr.render();
                },1000);
            }
            resolve();
        });
    });
}

/**
 * Delete the div used by self for rendering and GC
 * 
 * @export
 * @param {GenomeView} self 
 */
export function cleanCanvas(self : GenomeView) : void
{
    let div = document.getElementById(self.div);
    //explicitly remove children to prevent creating detached DOM nodes
    while(div.firstChild)
    {
        div.removeChild(div.firstChild);
    }
    document.body.removeChild(div);
    //force a GC pass
    (<any>global).gc();
}

/**
 * Returns SVGs for all selected tracks, wrapped in divs ready for rendering
 * 
 * @export
 * @param {GenomeView} self 
 * @returns {string} 
 */
export function getSelectedDataTrackSVGsFromCache(self : GenomeView) : string
{
    let res = "";
    for(let i = 0; i != self.genome.renderedCoverageTracks.length; ++i)
    {
        if(self.genome.renderedCoverageTracks[i].checked)
        {
            try
            {
                res += `<div style="position:absolute;z-index:-99;">`;
                res += tc.getCachedCoverageTrack(self.genome.renderedCoverageTracks[i]);
                res += `</div>`;
            }
            catch(err){}
        }
    }
    for(let i = 0; i != self.genome.renderedSNPTracks.length; ++i)
    {
        if(self.genome.renderedSNPTracks[i].checked)
        {
            try
            {
                res += `<div style="position:absolute;z-index:-99;">`;
                res += tc.getCachedSNPTrack(self.genome.renderedSNPTracks[i]);
                res += `</div>`;
            }
            catch(err){}
        }
    }
    return res;
}