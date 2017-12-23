import * as fs from "fs";

import {GenomeView} from "./genomeView";
import * as cf from "./../circularFigure";
/**
 * Writes the SVG to fileName. Allows DOM updates to interleave execution
 * 
 * @export
 * @param {GenomeView} self 
 * @param {string} fileName 
 * @param {string} svg 
 * @returns {Promise<void>} 
 */
export async function writeSVG(self : GenomeView,fileName : string,svg : string) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        (async function() : Promise<void>{
            return new Promise<void>((resolve,reject) => {
                setImmediate(function(){
                    setImmediate(function(){
                        fs.writeFileSync(fileName,svg);
                        resolve();
                    });
                });
            });
        })().then(() => {
            resolve();
        });
    });
}

/**
 * Serializes the canvas div. Allows DOM updates to interleave execution
 * 
 * @export
 * @param {GenomeView} self 
 * @returns {Promise<string>} 
 */
export async function serializeFigure(self : GenomeView) : Promise<string>
{
    return new Promise<string>((resolve,reject) => {
        (async function() : Promise<string>{
            return new Promise<string>((resolve,reject) => {
                setImmediate(function(){
                    setImmediate(function(){
                        resolve(
                            new XMLSerializer().serializeToString(
                                document.getElementById(self.div).children[0]
                            )
                        );
                    });
                });
            });
        })().then((svg : string) => {
            resolve(svg);
        });
    });
}

/*
    When creating an SVG, we cant just serialize the output from displayFigure.
    displayFigure does all kinds of SVG caching and layering to be performant but the output is not
    valid SVG. Here, we pass all of the raw templates needed for the current figure to angular to compile into
    one single SVG that is ready for serialization.
*/
/**
 * JIT compiles the entire figure into one SVG, ignoring all precompiled SVGS. Allows DOM updates to interleave execution
 * 
 * @export
 * @param {GenomeView} self 
 * @returns {Promise<void>} 
 */
export async function renderSVG(self : GenomeView) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        (async function() : Promise<void>{
            setImmediate(function(){
                setImmediate(function(){
                    try
                    {
                        document.body.removeChild(document.getElementById(self.div));
                    }
                    catch(err){}
                    resolve();
                });
            });
        })().then(() => {
            (async function() : Promise<void>{
                return new Promise<void>((resolve,reject) => {
                    setImmediate(function(){
                        setImmediate(function(){
                            let templates = cf.assembleCompilableTemplates(
                                self.genome,
                                `
                                ${(()=>{
                                    let res = "";
                                    for(let i = 0; i != self.genome.renderedCoverageTracks.length; ++i)
                                    {
                                        if(self.genome.renderedCoverageTracks[i].checked)
                                        {
                                            try
                                            {
                                                res += fs.readFileSync(cf.getCachedCoverageTrackTemplatePath(self.genome.renderedCoverageTracks[i])).toString();
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
                                                res += fs.readFileSync(cf.getCachedSNPTrackTemplatePath(self.genome.renderedSNPTracks[i])).toString();
                                            }
                                            catch(err){}
                                        }
                                    }
                                    return res;
                                })()}
                                ${cf.getBaseFigureTemplateFromCache(self.genome)}
                                `,self.div
                            );
                            let $div = $(templates);
                            $(document.body).append($div);
                            angular.element(document).injector().invoke(function($compile : any){
                                let scope = angular.element($div).scope();
                                self.updateScope(scope);
                                $compile($div)(scope);
                                resolve();
                            });
                        });
                    });
                });
            })();
        });
    });
}