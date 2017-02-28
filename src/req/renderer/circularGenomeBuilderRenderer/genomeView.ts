//// <reference path="jquery.d.ts" />
import * as viewMgr from "./../viewMgr";
import {Contig,FastaContigLoader} from "./../circularGenome/fastaContigLoader";
import {DataModelMgr} from "./../model";
let plasmidTrack = require("./../circularGenome/plasmidTrack");
let plasmid = require("./../circularGenome/plasmid");
let trackLabel = require("./../circularGenome/trackLabel");
let trackMarker = require("./../circularGenome/trackMarker");
let markerLabel = require("./../circularGenome/markerLabel");
let trackScale = require("./../circularGenome/trackScale");

let angular : any;
require("angular");
require("angularplasmid");
//adapted from answer by letronje and edited by Peter Mortensen
//http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandColor(brightness : number)
{
    // Six levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){return Math.round(x/2.0)});
    return "rgb(" + mixedrgb.join(",") + ")";
}
let app = angular.module('myApp',['angularplasmid']);
export class GenomeView extends viewMgr.View
{
    public genome : any;
    public constructor(name : string,div : string, model : DataModelMgr)
    {
        super(name,div,model);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.genome)
        {
            //Remove the div this view is bound to
            document.body.removeChild(document.getElementById(this.div));
            $("#"+this.div).remove();

            let totalBP = 0;
            for(let i = 0; i != this.genome.contigs.length; ++i)
            {
                totalBP += this.genome.contigs[i].bp;
            }
            //This is an unholy mess adapted from the example given inline in the
            //angular source code https://github.com/angular/angular.js/blob/master/src/auto/injector.js
            //We remove the div this view is bound to, recreate it and re render the angular template into it
            //Then we pass the div into angular to compile the templates and then finally inject it all back into
            //the page
            let $div = $
            (
                `<div id="${this.div}">
                    ${plasmid.add(
                    {
                        sequenceLength : totalBP.toString(),
                        plasmidHeight : "300",
                        plasmidWidth : "300"
                    })}
                        ${plasmidTrack.add(
                        {
                            trackStyle : "fill:#f0f0f0;stroke:#ccc",
                            radius : "120"
                        })}
                            ${trackLabel.add(
                            {
                                text : this.genome.contigs[0].name,
                                labelStyle : "font-size:20px;font-weight:400"
                            })}
                            ${trackLabel.end()}
                            ${(()=>
                            {
                                let res = "";
                                let lastLocation = 0;
                                for(let i = 0; i != this.genome.contigs.length; ++i)
                                {
                                    res += `
                                        ${trackMarker.add(
                                        {
                                            start : lastLocation.toString(),
                                            end : (lastLocation + this.genome.contigs[i].bp).toString(),
                                            markerStyle : "fill:"+getRandColor(1)
                                        })}
                                            ${markerLabel.add(
                                            {
                                                type : "path",
                                                text : this.genome.contigs[i].name
                                            })}
                                            ${markerLabel.end()}
                                        ${trackMarker.end()}
                                    `;
                                    lastLocation = lastLocation + this.genome.contigs[i].bp;
                                }
                                return res; 
                            })()}
                            ${trackScale.add(
                            {
                                interval : "100",
                                vAdjust : "5",
                                showLabels : "1"
                            }
                            )}
                            ${trackScale.end()}
                        ${plasmidTrack.end()}
                    ${plasmid.end()}
                </div>
            `);
            $(document.body).append($div);
            angular.element(document).injector().invoke
            (
                function($compile : any)
                {
                    let scope = angular.element($div).scope();
                    $compile($div)(scope);
                }
            );

        }
        return undefined;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string,model : DataModelMgr)
{
    arr.push(new GenomeView("genomeView",div,model));
}