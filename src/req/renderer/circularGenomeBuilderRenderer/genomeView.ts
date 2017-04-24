//// <reference path="jquery.d.ts" />
/// <reference path="./../angularStub.d.ts" />
import * as util from "util";

import * as viewMgr from "./../viewMgr";
import {CircularFigure} from "./../circularFigure";
import * as plasmid from "./../circularGenome/plasmid";
import * as plasmidTrack from "./../circularGenome/plasmidTrack";
import * as trackLabel from "./../circularGenome/trackLabel";
import * as trackMarker from "./../circularGenome/trackMarker";
import * as markerLabel from "./../circularGenome/markerLabel";
import * as trackScale from "./../circularGenome/trackScale";

require("angular");
require("angularplasmid");

let app : any = angular.module('myApp',['angularplasmid']);
export class GenomeView extends viewMgr.View
{
    public genome : CircularFigure;
    public firstRender : boolean;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.firstRender = true;
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public markerOnClick($event : any,$marker : any,uuid : string) : void
    {
        console.log(util.inspect($event));
        console.log(util.inspect($marker));
        console.log(uuid);
    }
    public inputRadiusOnChange()
    {
        this.genome.height = this.genome.radius*2.5;
        this.genome.width =this.genome.radius*2.5;
        this.postRender();
        console.log(this.genome.radius+" "+this.genome.width+" "+this.genome.height);
    }
    public renderView() : string
    {
        let self = this;
        if(this.genome)
        {
            if(this.firstRender){
            try
            {
                document.body.removeChild(document.getElementById("controls"));
            }
            catch(err){}
            try
            {
                //Remove the div this view is bound to
                document.body.removeChild(document.getElementById(this.div));
            }
            catch(err){}
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
                `
                <div id="controls">
                    <input type="number" name="input" ng-model="genome.radius" ng-change="inputRadiusOnChange()" min="0" max="1000" required>
                </div>
                <div id="${this.div}" style="z-index=-1;">
                    ${plasmid.add(
                    {
                        sequenceLength : totalBP.toString(),
                        plasmidHeight : "{{genome.height}}",
                        plasmidWidth : "{{genome.width}}"
                    })}
                        ${plasmidTrack.add(
                        {
                            trackStyle : "fill:#f0f0f0;stroke:#ccc",
                            radius : "{{genome.radius}}"
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
                                            markerStyle : `fill:${this.genome.contigs[i].color}`,
                                            uuid : this.genome.contigs[i].uuid,
                                            onClick : "markerOnClick"
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
                                vAdjust : "5"
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
                    scope.genome = self.genome;
                    scope.markerOnClick = self.markerOnClick;
                    scope.inputRadiusOnChange = self.inputRadiusOnChange;
                    scope.postRender = self.postRender;
                    scope.div = self.div;
                    $compile($div)(scope);
                }
            );
            this.firstRender = false;
        }}
        return undefined;
    }
    public postRender() : void
    {
        console.log("Called post render");
        if(this.genome !== undefined)
        {
            //get a reference to the div wrapping the rendered svg graphic of our figure
            let div = document.getElementById(this.div);

            //expand the div to the new window size
            div.style.zIndex = "-1";
            div.style.position = "absolute";
            div.style.height = `${$(window).height()}px`;
            div.style.width = `${$(window).width()}px`;

            let x = 0;
            let y = 0;
            //center the div in the window
            x = ($(window).width()/2)-(this.genome.width/2);
            y = ($(window).height()/2)-(this.genome.height/2);
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
        }
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new GenomeView("genomeView",div));
}