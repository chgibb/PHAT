import * as fs from "fs";

import * as cf from "./../circularFigure";
import * as tc from "./templateCache";
import * as plasmid from "./../circularGenome/plasmid";
import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";
import {centreInteractiveFigure,centreNonInteractiveFigure} from "./centreFigure";

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
        await displayNonInteractiveFigure(self);
    else
        await displayInteractiveFigure(self);
    //force a GC pass
    (<any>global).gc();

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

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("nonInteractiveFigureCanvas");
        if(!canvas)
        {
            let $div = `
                <div id="canvasWrapper">
                    <canvas id="nonInteractiveFigureCanvas" style="position:absolute;left:0px;top:0px;"></canvas>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend",$div);
            canvas = <HTMLCanvasElement>document.getElementById("nonInteractiveFigureCanvas");
        }
        console.log(`canvas width ${document.documentElement.clientWidth*2}`);
        console.log(`canvas height ${document.documentElement.clientHeight*2}`);
        canvas.setAttribute("width",`${document.documentElement.clientWidth*2}`);
        canvas.setAttribute("height",`${document.documentElement.clientHeight*2}`);
        centreNonInteractiveFigure(self.genome);
        await tc.renderToCanvas(canvas.getContext("2d"),self);
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
    return new Promise<void>(async (resolve,reject) => {

        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let totalBP = 0;
        let $div : any;

        cleanCanvas(self);
        if(document.getElementById("canvasWrapper"))
            document.getElementById("canvasWrapper").outerHTML = "";
        
        for(let i = 0; i != self.genome.contigs.length; ++i)
        {
            totalBP += self.genome.contigs[i].bp;
        }
        await tc.refreshCache(self.genome);
        let templates = cf.assembleCompilableTemplates(
            self.genome,
            `
                ${self.showSeqSelector ? cf.buildSequenceSelectorTemplate(
                    self.genome,
                    self.seqSelectionLeftArm,
                    self.seqSelectionRightArm,
                    self.seqSelectionArrow
                ) : ""}
                ${cf.getBaseFigureTemplateFromCache(self.genome)}
            `
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
        centreInteractiveFigure(document.getElementById(self.div),self.genome);
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
 * Delete the div used by self for rendering
 * 
 * @export
 * @param {GenomeView} self 
 */
export function cleanCanvas(self : GenomeView) : void
{
    let div = document.getElementById(self.div);
    if(div)
    {
        //explicitly remove children to prevent creating detached DOM nodes
        while(div.firstChild)
        {
            div.removeChild(div.firstChild);
        }
        document.body.removeChild(div);
    }
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
            let map = tc.getCoverageTrack(self.genome.renderedCoverageTracks[i]);
            map.$scope = cf.makeMapScope(self.genome);
            res += `<div style="position:absolute;z-index:-99;">`;
            res += map.renderStart() + map.renderEnd();
            res += `</div>`;
        }
    }
    for(let i = 0; i != self.genome.renderedSNPTracks.length; ++i)
    {
        if(self.genome.renderedSNPTracks[i].checked)
        {
            let map = tc.getSNPTrack(self.genome.renderedSNPTracks[i]);
            map.$scope = cf.makeMapScope(self.genome);
            res += `<div style="position:absolute;z-index:-99;">`;
            res += map.renderStart() + map.renderEnd();
            res += `</div>`;
        }
    }
    return res;
}